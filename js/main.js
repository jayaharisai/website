(() => {
'use strict';
const menu = window.LEARNEW_MENU || [];
document.querySelector('ui-navbar').menu = menu;
const words = menu.flatMap((g) => g.items.map((i) => i.title));
const ticker = document.querySelector('ui-ticker');
if (words.length) ticker.words = words; else ticker.remove();

const MIN_LOADER_MS = 700;   // avoid a flash on fast connections
const MAX_LOADER_MS = 4000;  // never trap the user behind the loader

addEventListener('pageshow', () => document.getElementById('veil')?.remove());

const root = document.documentElement;
const start = performance.now();

const pageLoaded = document.readyState === 'complete'
  ? Promise.resolve()
  : new Promise((res) => addEventListener('load', res, { once: true }));

const ready = Promise.all([pageLoaded, document.fonts?.ready]).then(() => {
  const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - start));
  return new Promise((res) => setTimeout(res, wait));
});

const failsafe = new Promise((res) => setTimeout(res, MAX_LOADER_MS));

Promise.race([ready, failsafe]).then(() => {
  root.classList.add('is-ready');
  document.dispatchEvent(new CustomEvent('app:ready'));
  document.getElementById('loader')?.addEventListener(
    'transitionend', (e) => e.currentTarget.remove(), { once: true });
});
})();
