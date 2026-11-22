/* Concept / learning tiles: one way to preview a tile on each kind of device.
     mouse or trackpad : hover for a moment and a larger card grows out of the tile
     touch             : tap a tile and it opens in place; tap "Open" to go to the page, tap the tile again to close
   The tiles themselves are built by list-page.js. This file only adds the preview. */
(() => {
'use strict';
const root = document.querySelector('[data-group]');
const group = (window.LEARNEW_MENU || []).find((g) => g.label === root?.dataset.group);
const grid = root && root.querySelector('.grid');
if (!group || !grid) return;

const items = new Map(group.items.map((i) => [i.href, i]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls || '', textContent: text ?? '' });
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const itemOf = (card) => items.get(card.getAttribute('href'));

/* ---------- touch: tap to open in place ---------- */
function tapMode() {
  grid.classList.add('tap');
  grid.querySelectorAll('.card').forEach((card) => {
    const it = itemOf(card); if (!it) return;
    const body = el('span', 'more-in');
    body.append(el('span', 'more-tag', it.tag || ''), el('span', 'more-text', it.blurb || it.desc || ''), el('span', 'more-open', 'Open →'));
    card.append(el('span', 'more')); card.lastChild.append(body);
    card.setAttribute('aria-expanded', 'false');
  });
  let openCard = null;
  const set = (card, on) => { card.classList.toggle('is-open', on); card.setAttribute('aria-expanded', String(on)); };
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card'); if (!card) return;
    if (e.target.closest('.more-open')) return;                  /* the link: let it navigate */
    e.preventDefault();
    const wasOpen = card === openCard;
    if (openCard) set(openCard, false);
    openCard = wasOpen ? null : card;
    if (openCard) { set(openCard, true); openCard.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
  });
  document.addEventListener('input', () => { if (openCard) { set(openCard, false); openCard = null; } });
}

/* ---------- mouse: hover for a moment, a card grows out of the tile ---------- */
function hoverMode() {
  const DELAY = 1200, GRACE = 140, M = 12;
  let timer = 0, grace = 0, pop = null, cur = null;

  function close(immediate) {
    clearTimeout(timer); clearTimeout(grace); timer = grace = 0; cur = null;
    if (!pop) return;
    const p = pop; pop = null; p.classList.remove('on');
    if (immediate || reduce) p.remove(); else setTimeout(() => p.remove(), 200);
  }

  function open(card) {
    const it = itemOf(card);
    if (!it || card.hidden) return;
    const p = el('a', 'peek'); p.href = it.href;
    const inner = el('div', 'peek-in');
    inner.append(el('span', 'peek-tag', it.tag || ''), el('h3', '', it.title), el('p', '', it.blurb || it.desc || ''), el('span', 'peek-go', 'Open →'));
    p.append(inner);
    document.body.append(p);

    const r = card.getBoundingClientRect(), g = grid.getBoundingClientRect();
    const W = Math.min(Math.max(r.width * 1.5, 340), innerWidth - 2 * M);
    p.style.width = W + 'px';
    const H = p.offsetHeight;

    const nearLeft = r.left - g.left < r.width * .5, nearRight = g.right - r.right < r.width * .5;
    let left = nearLeft ? r.left : nearRight ? r.right - W : r.left + r.width / 2 - W / 2;   /* grows right / left / both ways */
    left = clamp(left, M, innerWidth - W - M);
    let top = r.top;                                                                          /* grows down ...                 */
    if (top + H > innerHeight - M) top = r.bottom - H;                                        /* ... or up near the bottom      */
    top = clamp(top, M, innerHeight - H - M);
    p.style.left = left + 'px'; p.style.top = top + 'px';

    const t = Math.max(0, r.top - top), l = Math.max(0, r.left - left);
    const rt = Math.max(0, left + W - r.right), b = Math.max(0, top + H - r.bottom);
    inner.style.setProperty('--from', `inset(${t}px ${rt}px ${b}px ${l}px round 12px)`);

    p.addEventListener('pointerenter', () => clearTimeout(grace));
    p.addEventListener('pointerleave', (e) => { if (!card.contains(e.relatedTarget)) close(); });
    p.addEventListener('pointerdown', () => close(true));
    pop = p; cur = card;
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('on')));
  }

  grid.addEventListener('pointerover', (e) => {
    const c = e.target.closest('.card');
    if (!c || c.contains(e.relatedTarget)) return;
    clearTimeout(grace);
    if (pop && cur !== c) close(true);
    if (cur === c) return;
    clearTimeout(timer); cur = c;
    timer = setTimeout(() => open(c), DELAY);
  });
  grid.addEventListener('pointerout', (e) => {
    const c = e.target.closest('.card');
    if (!c || c.contains(e.relatedTarget)) return;
    if (pop && pop.contains(e.relatedTarget)) return;
    if (pop) { grace = setTimeout(() => close(), GRACE); return; }
    clearTimeout(timer); timer = 0; cur = null;
  });
  grid.addEventListener('pointerdown', () => close(true));
  addEventListener('scroll', () => close(true), { passive: true });
  addEventListener('resize', () => close(true));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(true); });
  document.addEventListener('input', () => close(true));
  document.addEventListener('click', (e) => { if (e.target.closest('.chip, .reset, .clear')) close(true); });
}

(matchMedia('(hover: hover) and (pointer: fine)').matches ? hoverMode : tapMode)();
})();
