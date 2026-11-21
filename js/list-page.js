/* Renders a card page (search + filter) from the same data that feeds the navbar (data/menu.js). */
(() => {
'use strict';
const root = document.querySelector('[data-group]');
const group = (window.LEARNEW_MENU || []).find((g) => g.label === root?.dataset.group);
if (!root || !group) return;

const $ = (s) => root.querySelector(s);
const grid = $('.grid'), chips = $('.chips'), search = $('#q'), count = $('[data-count]'), empty = $('.empty');
const tags = [...new Set(group.items.map((i) => i.tag).filter(Boolean))];
const hue = Object.fromEntries(tags.map((t, i) => [t, i]));
let active = 'All';

const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls || '', textContent: text ?? '' });

/* cards */
const cards = group.items.map((it, i) => {
  const c = el('a', 'card'); c.href = it.href; c.dataset.h = hue[it.tag] ?? 0;
  const tag = el('span', 'tag', it.tag || '');
  const arrow = el('span', 'go'); arrow.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  c.append(tag, el('h2', '', it.title), el('p', '', it.blurb || it.desc), arrow);
  c.addEventListener('pointermove', (e) => {           /* spotlight follows the cursor */
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  c._text = [it.title, it.tag, it.desc, it.blurb].join(' ').toLowerCase();
  c._tag = it.tag;
  grid.append(c);
  return c;
});

/* filter chips */
['All', ...tags].forEach((t) => {
  const b = el('button', 'chip', t); b.type = 'button'; b.dataset.t = t;
  b.setAttribute('aria-pressed', t === 'All');
  const n = t === 'All' ? group.items.length : group.items.filter((x) => x.tag === t).length;
  b.append(el('sup', '', String(n)));
  chips.append(b);
});

const none = group.items.length === 0;
function apply() {
  const q = search.value.trim().toLowerCase();
  let shown = 0;
  cards.forEach((c) => {
    const ok = (active === 'All' || c._tag === active) && (!q || q.split(/\s+/).every((w) => c._text.includes(w)));
    c.hidden = !ok;
    if (ok) { c.style.setProperty('--i', shown++); c.classList.remove('in'); void c.offsetWidth; c.classList.add('in'); }
  });
  count.textContent = none ? '' : `${shown} of ${cards.length} topics`;
  empty.hidden = shown > 0;
  if (none) { empty.querySelector('p').textContent = "I’ve just started learning. Come back soon, and whatever I learn I’ll share here."; empty.querySelector('.reset').hidden = true; }
  $('.clear').hidden = !q;
}

chips.addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b) return;
  active = b.dataset.t;
  chips.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', x === b));
  apply();
});
search.addEventListener('input', apply);
$('.clear').addEventListener('click', () => { search.value = ''; search.focus(); apply(); });
$('.reset').addEventListener('click', () => { search.value = ''; active = 'All'; chips.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', x.dataset.t === 'All')); apply(); });
addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); }
  else if (e.key === 'Escape' && document.activeElement === search) { search.value = ''; apply(); search.blur(); }
});
apply();
})();
