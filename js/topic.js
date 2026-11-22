/* Topic page: left index + right content, both built from the topic in data/menu.js.
   A topic can carry   sections: [{ id: 'overview', title: 'Overview', html: '<p>...</p>' }]   for the real notes. */
(() => {
'use strict';
const q = new URLSearchParams(location.search);
const groups = window.LEARNEW_MENU || [];
const group = groups.find((g) => g.label === q.get('g')) || groups[0];
const $ = (s) => document.querySelector(s);
const el = (t, c, h) => Object.assign(document.createElement(t), { className: c || '', innerHTML: h ?? '' });
const c = $('.body-content'), toc = $('.toc');
const back = $('[data-back]');
if (group) { back.href = group.all; back.textContent = `← All ${group.label.toLowerCase()}`; }

const idx = group ? group.items.findIndex((i) => i.href.endsWith('t=' + q.get('t'))) : -1;
const item = group && group.items[idx];
if (!item) {                                       // nothing to show yet
  document.title = 'LearNew';
  $('.index .side-h').hidden = true;
  c.append(el('h1', 'topic-title', 'Still learning this one'), el('p', 'lead-none', 'I haven’t shared this yet. Come back soon, and I’ll add it as I learn.'));
  return;
}

document.title = `${item.title} · ${group.label} · LearNew`;
const SECTIONS = item.sections || [];

c.append(el('p', 'crumbs', `<a href="${group.all}">${group.label}</a><span>/</span>${item.title}`));
c.append(el('h1', 'topic-title', item.title));
c.append(el('div', 'meta-row', [item.tag, SECTIONS.length ? `${SECTIONS.length} sections` : ''].filter(Boolean).map((t) => `<span class="pill">${t}</span>`).join('')));
if (item.blurb || item.desc) c.append(el('p', 'lead-none', item.blurb || item.desc));
if (!SECTIONS.length) { c.append(el('p', 'lead-none soft', 'I’m still learning this one. Come back soon and I’ll share what I find.')); $('.index .side-h').hidden = true; }
SECTIONS.forEach((s) => c.append(el('section', 'sec', `<h2 id="${s.id}"><a href="#${s.id}">${s.title}</a></h2>${s.html}`)));

const prev = group.items[idx - 1], next = group.items[idx + 1];
if (prev || next) c.append(el('div', 'pn',
  (prev ? `<a class="pn-a" href="${prev.href}"><small>← Previous</small><b>${prev.title}</b></a>` : '<span></span>')
  + (next ? `<a class="pn-a r" href="${next.href}"><small>Next →</small><b>${next.title}</b></a>` : '<span></span>')));

/* left: index with scroll-spy */
SECTIONS.forEach((s, i) => { const a = el('a', '', `<span>${String(i + 1).padStart(2, '0')}</span>${s.title}`); a.href = '#' + s.id; a.dataset.id = s.id; toc.append(a); });
const links = [...toc.children];
const idxBox = toc.closest('.index');
let curLabel = null;
if (idxBox && SECTIONS.length) {                    /* narrow screens: the index is a dropdown showing the current section */
  const btn = el('button', 'toc-toggle', '<span class="tt-l">On this page</span><span class="tt-c"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');
  btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
  toc.before(btn); curLabel = btn.querySelector('.tt-c'); curLabel.textContent = SECTIONS[0].title;
  btn.addEventListener('click', () => { const o = idxBox.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o)); });
}
const heads = SECTIONS.map((s) => document.getElementById(s.id));
function spy() {
  const y = innerHeight * .28; let cur = 0;
  heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= y) cur = i; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = heads.length - 1;
  links.forEach((a, i) => a.classList.toggle('on', i === cur));
  if (curLabel) curLabel.textContent = SECTIONS[cur].title;
  const box = toc.closest('.index'), on = links[cur];           /* keep the active item visible in the scrolling index */
  if (box && on && box.scrollHeight > box.clientHeight) {
    const top = on.getBoundingClientRect().top - box.getBoundingClientRect().top;
    if (top < 60 || top > box.clientHeight - 60) box.scrollTo({ top: box.scrollTop + top - box.clientHeight / 2, behavior: 'auto' });
  }
}
if (heads.length) { addEventListener('scroll', spy, { passive: true }); addEventListener('resize', spy); spy(); }
toc.addEventListener('click', (e) => {
  const a = e.target.closest('a'); if (!a) return;
  if (idxBox) { idxBox.classList.remove('open'); idxBox.querySelector('.toc-toggle')?.setAttribute('aria-expanded', 'false'); }
  e.preventDefault(); document.getElementById(a.dataset.id).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});
})();

/* right rail: 30px collapsed, 40% open. Inside: a collapsible topic tree.
   The content lives in data/paths.js, one line per topic box:
     >>  Title: what it is | covered one; covered two ~ project to build @page-to-read
   Each ">" is one level deeper; a box is connected to the nearest box above it that is one level shallower. */
(() => {
const el = (t, c, h) => Object.assign(document.createElement(t), { className: c || '', innerHTML: h ?? '' });
const q = new URLSearchParams(location.search);
const groups = window.LEARNEW_MENU || [];
const group = groups.find((g) => g.label === q.get('g')) || groups[0];
const cur = group && group.items.find((i) => i.href.endsWith('t=' + q.get('t')));
if (!cur) return;
const slug = (cur.href.match(/t=([\w-]+)/) || [])[1];
const all = groups.flatMap((g) => g.items);
const T = cur.title;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* parse the lines into nodes */
const src = (window.LEARNEW_PATHS || {})[slug];
if (!src) return;                                  // no map written for this topic yet: no sidebar
const raw = src.split('\n').map((l) => l.trim()).filter(Boolean);
const STEPS = []; const lastAt = [];
raw.forEach((line) => {
  const depth = line.match(/^>*/)[0].length;
  let txt = line.replace(/^>+\s*/, '');
  const link = (txt.match(/\s@([\w-]+)\s*$/) || [])[1]; txt = txt.replace(/\s@[\w-]+\s*$/, '');
  const [head, build = ''] = txt.split(/\s*~\s*/);
  const [main, covers = ''] = head.split(/\s*\|\s*/);
  const [title, ...d] = main.split(/:\s+/);
  const parent = depth === 0 ? -1 : (lastAt[depth - 1] ?? 0);
  const n = { title, desc: d.join(': '), covers: covers.split(/\s*;\s*/).filter(Boolean), build, link, depth, parent, kids: [] };
  lastAt[depth] = STEPS.length; lastAt.length = depth + 1;
  STEPS.push(n); if (parent >= 0) STEPS[parent].kids.push(STEPS.length - 1);
});
const fallbackLinks = (i) => all.filter((x) => x !== cur).slice(i % 5, (i % 5) + 2);
const linksFor = (i) => {
  const hit = STEPS[i].link && all.find((x) => x.href.endsWith('t=' + STEPS[i].link));
  return hit ? [hit, ...fallbackLinks(i).slice(0, 1)] : fallbackLinks(i);
};

/* each main topic gets its own colour; everything under it inherits it */
const PAL = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#3b82f6'];
let mi = 0;
STEPS.forEach((st) => { st.col = st.depth === 0 ? '#475569' : st.depth === 1 ? PAL[mi++ % PAL.length] : STEPS[st.parent].col; });
const count = (i) => STEPS[i].kids.reduce((a, k) => a + 1 + count(k), 0);
const ICON = [
  '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',        // intro: sparkle
  '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>', // main: grid
  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/></svg>',                                              // sub-topic: dot
];

/* ---- DOM: a collapsible trace-style tree ---- */
const scrim = el('div', 'scrim');
const rail = el('aside', 'rail');
rail.setAttribute('aria-label', 'Learning map');
rail.innerHTML = `
  <button class="rail-btn" type="button" aria-expanded="false" aria-controls="rail-body" aria-label="Open learning map">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>
  </button>
  <div class="rail-body" id="rail-body" inert>
    <div class="rail-in">
      <p class="rail-eyebrow">Learning map</p>
      <h2>${T}</h2>
      <div class="rail-bar">
        <span><b>${STEPS.length}</b> topics to explore</span>
        <span class="rail-acts"><button type="button" data-act="open">Expand all</button><button type="button" data-act="shut">Collapse all</button></span>
      </div>
      <ul class="tree" role="tree"></ul>
    </div>
  </div>`;
document.body.append(scrim, rail);

const btn = rail.querySelector('.rail-btn'), body = rail.querySelector('.rail-body');
const tree = rail.querySelector('.tree');
const lis = [];

const LEVEL = (d) => (d <= 2 ? 'Beginner' : d === 3 ? 'Intermediate' : 'Advanced');
const trail = (i) => { const t = []; for (let k = i; k >= 0; k = STEPS[k].parent) t.unshift(k); return t; };
function detail(i) {
  const s = STEPS[i], path = trail(i), ahead = count(i);
  const crumbs = path.map((k, n) => n === path.length - 1 ? `<b>${STEPS[k].title}</b>` : `<button type="button" data-go="${k}">${STEPS[k].title}</button>`).join('<span>›</span>');
  const before = path.slice(0, -1).filter((k) => k !== 0 || path.length === 2);
  const meta = [s.depth === 0 ? 'Start here' : LEVEL(s.depth), `${s.covers.length} concepts`, ahead ? `${ahead} topic${ahead > 1 ? 's' : ''} inside` : 'end of this path'].join(' · ');
  return `<div class="det-in">
    <div class="det-crumbs">${crumbs}</div>
    <p class="det-meta">${meta}</p>
    <p class="det-d">${s.desc}</p>
    ${s.covers.length ? `<h4>Concepts covered</h4><ul class="cov">${s.covers.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
    ${s.depth ? `<h4>Learn this first</h4><div class="chips2">${before.map((k) => `<button type="button" data-go="${k}">${STEPS[k].title}</button>`).join('') || '<span class="none">Nothing, you can start right here.</span>'}</div>` : ''}
    ${s.build ? `<h4>Project to build</h4><p class="proj">${s.build}</p>` : ''}
    ${s.kids.length ? `<h4>What comes next</h4><div class="nexts">${s.kids.map((k) => `<button type="button" data-go="${k}"><b>${STEPS[k].title}</b><small>${STEPS[k].desc}</small></button>`).join('')}</div>` : ''}
    <h4>Read more on our pages</h4>
    <div class="det-links">${linksFor(i).map((l) => `<a href="${l.href}"><b>${l.title}</b><small>${l.tag || ''}${l.desc ? ' · ' + l.desc : ''}</small></a>`).join('')}</div>
  </div>`;
}

function build(i, open) {
  const s = STEPS[i];
  const li = el('li', 'tn'); li.style.setProperty('--c', s.col); li.dataset.i = i; li.setAttribute('role', 'treeitem');
  const row = el('div', 'tr');
  const chev = s.kids.length ? el('button', 'chev', '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>') : el('span', 'chev none');
  if (s.kids.length) { chev.type = 'button'; chev.setAttribute('aria-label', 'Expand or collapse ' + s.title); }
  const lab = el('button', 'lab');
  lab.type = 'button';
  lab.innerHTML = `<span class="ic">${ICON[Math.min(2, s.depth)]}</span><span class="tt">${s.title}</span>${s.kids.length ? `<span class="ct">${count(i)}</span>` : ''}`;
  row.append(chev, lab);
  const det = el('div', 'det', '<div></div>');
  li.append(row, det);
  let kids = null;
  if (s.kids.length) {
    kids = el('div', 'kids', '<ul role="group"></ul>');
    s.kids.forEach((k) => kids.firstChild.append(build(k, s.depth + 1 <= 1)));
    li.append(kids);
  }
  if (s.kids.length && s.depth <= 1) li.classList.add('is-open');
  chev.onclick = () => li.classList.toggle('is-open');
  lab.onclick = () => select(i);
  li._lab = lab; lis[i] = li;
  return li;
}
tree.append(build(0));

function jump(i) {                                  // open every parent, select the topic, bring it into view
  for (let k = STEPS[i].parent; k >= 0; k = STEPS[k].parent) lis[k].classList.add('is-open');
  if (!lis[i].classList.contains('is-sel')) select(i);
  setTimeout(() => lis[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 80);
}
function select(i) {
  const li = lis[i], on = !li.classList.contains('is-sel');
  if (on) {
    const d = li.querySelector(':scope > .det > div');
    if (!d.firstChild) d.innerHTML = detail(i);
    d.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => jump(+b.dataset.go)));
    if (STEPS[i].kids.length) li.classList.add('is-open');
  }
  li.classList.toggle('is-sel', on);
  li._lab.setAttribute('aria-expanded', on);
}
rail.querySelector('.rail-acts').addEventListener('click', (e) => {
  const a = e.target.dataset.act; if (!a) return;
  lis.forEach((li, i) => { if (STEPS[i].kids.length) li.classList.toggle('is-open', a === 'open' ? true : STEPS[i].depth === 0); });
});

/* ---- the rail itself: 30px collapsed, 40% open ---- */
const set = (on) => {
  rail.classList.toggle('open', on); scrim.classList.toggle('on', on);
  btn.setAttribute('aria-expanded', on); btn.setAttribute('aria-label', on ? 'Collapse learning map' : 'Open learning map');
  body.inert = !on;
};
btn.addEventListener('click', () => set(!rail.classList.contains('open')));
scrim.addEventListener('click', () => set(false));
addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();
