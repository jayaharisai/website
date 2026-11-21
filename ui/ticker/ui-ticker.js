/**
 * <ui-ticker label="Now exploring"></ui-ticker>
 * Cycles through `words` with a vertical, blur-in slide. Pauses when the tab is hidden.
 */
(() => {
'use strict';
const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host { display: inline-flex; align-items: center; gap: 12px; padding: 8px 18px 8px 14px; border-radius: 999px;
    background: #ffffff0d; border: 1px solid #ffffff1c; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    font: 500 13px/1 "JetBrains Mono", ui-monospace, Menlo, monospace; letter-spacing: .02em; color: #c9b8e8; }
  .label::after { content: " →"; color: #e879f9; }
  .win { display: inline-grid; overflow: hidden; padding: 4px 0; color: #fff; }
  .w { grid-area: 1 / 1; white-space: nowrap; opacity: 0; transform: translateY(120%); filter: blur(6px);
    transition: transform .7s cubic-bezier(.22,1,.36,1), opacity .5s, filter .6s; }
  .w.on  { opacity: 1; transform: none; filter: none; }
  .w.out { opacity: 0; transform: translateY(-120%); filter: blur(6px); }
  @media (prefers-reduced-motion: reduce) { .w { transition: none; } }
</style>
<span class="label"></span><span class="win"></span>`;

class UiTicker extends HTMLElement {
  #words = []; #i = 0; #timer = 0; #win; #els = [];

  set words(v) { this.#words = v ?? []; if (this.isConnected) this.#build(); }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).append(tpl.content.cloneNode(true));
    this.shadowRoot.querySelector('.label').textContent = this.getAttribute('label') ?? '';
    this.#win = this.shadowRoot.querySelector('.win');
    this.#build();
    this._vis = () => (document.hidden ? this.#stop() : this.#start());
    document.addEventListener('visibilitychange', this._vis);
  }
  disconnectedCallback() { this.#stop(); document.removeEventListener('visibilitychange', this._vis); }

  #build() {
    this.#stop();
    this.#win.replaceChildren();
    this.#els = this.#words.map((t) => {
      const s = document.createElement('span'); s.className = 'w'; s.textContent = t; s.setAttribute('aria-hidden', 'true');
      this.#win.append(s); return s;
    });
    if (!this.#els.length) return;
    this.#i = 0; this.#show(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this.#start();
  }
  #show(i) {
    this.#els.forEach((e, k) => {
      if (k === i) { e.classList.remove('out'); e.classList.add('on'); e.removeAttribute('aria-hidden'); }
      else if (e.classList.contains('on')) { e.classList.replace('on', 'out'); e.setAttribute('aria-hidden', 'true'); }
      else if (e.classList.contains('out')) {   // reset exited words below, without animating
        e.style.transition = 'none'; e.classList.remove('out'); void e.offsetWidth; e.style.transition = '';
      }
    });
  }
  #start() { if (!this.#timer && this.#els.length > 1) this.#timer = setInterval(() => { this.#i = (this.#i + 1) % this.#els.length; this.#show(this.#i); }, 2400); }
  #stop() { clearInterval(this.#timer); this.#timer = 0; }
}

customElements.define('ui-ticker', UiTicker);
})();
