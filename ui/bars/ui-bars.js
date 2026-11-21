/**
 * <ui-bars></ui-bars>  — full-screen canvas background.
 *  - Intro:      bars rain in as a ripple spreading from the top centre.
 *  - Idle:       a slow wave breathes through the field; a blue scan ring sweeps across it.
 *  - Pointer:    a black hole. Bars spiral in, stretch toward it and vanish at the core.
 *  - Water:      moving the pointer sheds soft ripples; a click makes a big splash.
 * Physics is time-based (frame-rate independent); drawing is batched into a few dozen strokes.
 */
(() => {
'use strict';
const SPACING_X = 22, SPACING_Y = 36;
const RADIUS = 250, PULL = 0.93, SWIRL = 1.25;
const A_LEVELS = 14, B_LEVELS = 5;           // quantised alpha / blueness -> draw buckets
const STIFFNESS = 150, DAMPING = 17;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// bucket palette: dusty violet -> hot pink
const PALETTE = [];
for (let a = 0; a < A_LEVELS; a++) for (let b = 0; b < B_LEVELS; b++) {
  const k = b / (B_LEVELS - 1), al = ((a + 1) / A_LEVELS).toFixed(3);
  PALETTE.push(`rgba(${Math.round(120 + 116 * k)},${Math.round(105 - 33 * k)},${Math.round(165 + 35 * k)},${al})`);
}

class UiBars extends HTMLElement {
  #c; #ctx; #w = 0; #h = 0; #dpr = 1; #n = 0;
  #hx; #hy; #x; #y; #vx; #vy; #s; #len; #seed; #delay; #seg; #bucket;
  #raf = 0; #last = 0; #t0 = null; #reduced = false;
  #mx = -1e4; #my = -1e4; #tx = -1e4; #ty = -1e4; #strength = 0; #want = 0;
  #rad = RADIUS; #idle = 0; #waves = []; #ro; #off = []; #lastRipple = 0; #lrx = 0; #lry = 0;

  /** strength 1 = click splash, ~0.35 = soft trail ripple */
  #ripple(x, y, k) {
    this.#waves.push({ x, y, t: performance.now(), speed: 420 + 260 * k, life: 1.4 + 1.2 * k, amp: 5200 * k });
    if (this.#waves.length > 7) this.#waves.shift();
  }

  connectedCallback() {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>
      :host{position:fixed;inset:0;z-index:0;pointer-events:none;display:block}
      canvas{width:100%;height:100%;display:block}
    </style><canvas aria-hidden="true"></canvas>`;
    this.#c = root.querySelector('canvas');
    this.#ctx = this.#c.getContext('2d');
    this.#reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.#ro = new ResizeObserver(() => this.#resize());
    this.#ro.observe(this);
    this.#resize();

    const on = (t, e, f, o) => { t.addEventListener(e, f, o); this.#off.push(() => t.removeEventListener(e, f, o)); };
    if (!this.#reduced) {
      const aim = (e) => {                           // finger or mouse: same black hole, a bit bigger under a finger
        this.#rad = e.pointerType === 'touch' ? 310 : RADIUS;
        if (this.#want === 0) { this.#mx = e.clientX; this.#my = e.clientY; }
        this.#tx = e.clientX; this.#ty = e.clientY; this.#want = 1;
      };
      on(window, 'pointermove', (e) => {
        aim(e);
        const now = performance.now();
        if (now - this.#lastRipple > 140 && Math.hypot(e.clientX - this.#lrx, e.clientY - this.#lry) > 70) {
          this.#ripple(e.clientX, e.clientY, 0.35); this.#lastRipple = now; this.#lrx = e.clientX; this.#lry = e.clientY;
        }
      }, { passive: true });
      on(window, 'pointerdown', (e) => {
        if (e.target.closest?.('a,button,ui-navbar')) return;
        aim(e); this.#lrx = e.clientX; this.#lry = e.clientY;
        this.#ripple(e.clientX, e.clientY, 1);
      }, { passive: true });
      const lift = (e) => { if (e.pointerType === 'touch') this.#want = 0; };   // finger up: the hole closes
      on(window, 'pointerup', lift); on(window, 'pointercancel', lift);
      on(document.documentElement, 'pointerleave', () => (this.#want = 0));
      on(window, 'blur', () => (this.#want = 0));
      if (matchMedia('(pointer: coarse)').matches) {  // touch screens have no hover, so keep the water alive on its own
        this.#idle = setInterval(() => {
          if (document.hidden || this.#want) return;
          this.#ripple(this.#w * (0.15 + Math.random() * 0.7), this.#h * (0.2 + Math.random() * 0.6), 0.55);
        }, 3200);
      }
    }

    const start = () => { this.#t0 = performance.now(); };
    if (this.#reduced) this.#t0 = -1e6;
    else if (document.documentElement.classList.contains('is-ready')) start();
    else document.addEventListener('app:ready', start, { once: true });

    this.#last = performance.now();
    this.#raf = requestAnimationFrame(this.#frame);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.#raf); clearInterval(this.#idle);
    this.#ro?.disconnect();
    this.#off.forEach((f) => f()); this.#off = [];
  }

  #resize() {
    const r = this.getBoundingClientRect();
    this.#w = r.width; this.#h = r.height;
    this.#dpr = Math.min(2, devicePixelRatio || 1);
    this.#c.width = Math.round(this.#w * this.#dpr);
    this.#c.height = Math.round(this.#h * this.#dpr);

    const cols = Math.ceil(this.#w / SPACING_X) + 1, rows = Math.ceil(this.#h / SPACING_Y) + 1;
    const n = (this.#n = cols * rows);
    const f = () => new Float32Array(n);
    this.#hx = f(); this.#hy = f(); this.#x = f(); this.#y = f(); this.#vx = f(); this.#vy = f();
    this.#s = f(); this.#len = f(); this.#seed = f(); this.#delay = f();
    this.#seg = new Float32Array(n * 4); this.#bucket = new Int16Array(n);
    const maxD = Math.hypot(this.#w / 2, this.#h);
    let i = 0;
    for (let r2 = 0; r2 < rows; r2++) for (let c2 = 0; c2 < cols; c2++, i++) {
      const hx = c2 * SPACING_X + (r2 % 2) * SPACING_X / 2 + (Math.random() - .5) * 6;
      const hy = r2 * SPACING_Y + (Math.random() - .5) * 14;
      this.#hx[i] = this.#x[i] = hx; this.#hy[i] = this.#y[i] = hy;
      this.#len[i] = 12 + Math.random() * 16;
      this.#seed[i] = Math.random();
      this.#delay[i] = (Math.hypot(hx - this.#w / 2, hy) / maxD) * 1.6 + Math.random() * 0.25;
    }
  }

  #frame = (now) => {
    this.#raf = requestAnimationFrame(this.#frame);
    const dt = Math.min(1 / 30, (now - this.#last) / 1000); this.#last = now;
    const ctx = this.#ctx, w = this.#w, h = this.#h, n = this.#n;
    ctx.setTransform(this.#dpr, 0, 0, this.#dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (this.#t0 === null || dt <= 0) return;

    const t = (now - this.#t0) / 1000;
    const kPtr = 1 - Math.exp(-dt * 16), kStr = 1 - Math.exp(-dt * 4.5), kS = 1 - Math.exp(-dt * 9);
    this.#mx += (this.#tx - this.#mx) * kPtr;
    this.#my += (this.#ty - this.#my) * kPtr;
    this.#strength += (this.#want - this.#strength) * kStr;
    const st = this.#strength, mx = this.#mx, my = this.#my;
    const cx = w / 2, cy = h * 0.6, maxD = Math.hypot(w, h);

    // shockwaves: drop expired
    this.#waves = this.#waves.filter((s) => now - s.t < s.life * 1000);
    // blue scan ring (idle)
    const scanR = t > 1.8 ? ((t - 1.8) * 300) % (maxD + 500) - 120 : -1e3;

    const counts = new Int32Array(A_LEVELS * B_LEVELS);
    const seg = this.#seg, bucket = this.#bucket;

    for (let i = 0; i < n; i++) {
      const hx = this.#hx[i], hy = this.#hy[i];
      const p = easeOut(clamp01((t - this.#delay[i]) / 0.9));
      if (p <= 0) { bucket[i] = -1; continue; }

      // idle breathing
      const wave = Math.sin(Math.hypot(hx - cx, hy - cy) * 0.014 - t * 0.9 + this.#seed[i] * 0.6) * 0.5 + 0.5;
      let len = this.#len[i] * (0.65 + 0.55 * wave);
      let alpha = 0.16 + 0.5 * wave;
      let glow = 0;

      // scan ring glow
      const ds = Math.abs(Math.hypot(hx - cx, hy - cy) - scanR);
      if (ds < 70) glow = 1 - ds / 70;

      // black hole influence
      let f = 0, rx = 0, ry = 0;
      if (st > 0.001) {
        rx = hx - mx; ry = hy - my;
        const d = Math.hypot(rx, ry);
        f = d < this.#rad ? Math.pow(1 - d / this.#rad, 1.4) * st : 0;
      }
      this.#s[i] += (f - this.#s[i]) * kS;
      const s = this.#s[i];

      // target = spiral toward the hole
      let tx = hx + Math.sin(hy * 0.012 + t * 0.7) * 3,
          ty = hy - (1 - p) * 50 + Math.sin(hx * 0.011 + hy * 0.005 + t * 0.9) * 5;
      if (s > 0.002) {
        const ang = s * SWIRL, ca = Math.cos(ang), sa = Math.sin(ang), k = 1 - s * PULL;
        tx = mx + (rx * ca - ry * sa) * k;
        ty = my + (rx * sa + ry * ca) * k - (1 - p) * 50;
      }

      // spring (+ shockwave force)
      let ax = (tx - this.#x[i]) * STIFFNESS - this.#vx[i] * DAMPING;
      let ay = (ty - this.#y[i]) * STIFFNESS - this.#vy[i] * DAMPING;
      for (const sw of this.#waves) {
        const age = (now - sw.t) / 1000, R = age * sw.speed, ex = hx - sw.x, ey = hy - sw.y;
        const d = Math.hypot(ex, ey), off = d - R;
        if (Math.abs(off) < 200 && d > 1) {
          const env = Math.pow(1 - Math.abs(off) / 200, 2) * (1 - age / sw.life);
          const osc = Math.cos(off / 26);
          ax += (ex / d) * osc * env * sw.amp; ay += (ey / d) * osc * env * sw.amp;
          glow = Math.max(glow, env * (0.5 + 0.5 * osc));
        }
      }
      this.#vx[i] += ax * dt; this.#vy[i] += ay * dt;
      this.#x[i] += this.#vx[i] * dt; this.#y[i] += this.#vy[i] * dt;
      const x = this.#x[i], y = this.#y[i];

      // orientation: vertical -> pointing into the hole
      let dx = 0, dy = 1;
      if (s > 0.01) {
        const ex = mx - x, ey = my - y, el = Math.hypot(ex, ey) || 1, m = Math.min(1, s * 1.6);
        dx = (ex / el) * m; dy = 1 + (ey / el - 1) * m;
        const nl = Math.hypot(dx, dy) || 1; dx /= nl; dy /= nl;
        len *= 1 + 1.5 * s;
        alpha += s * 0.5;
        alpha *= 1 - smooth(0.8, 0.97, s);
      }
      // motion streak: bars lengthen slightly with speed
      const sp = Math.hypot(this.#vx[i], this.#vy[i]);
      len += Math.min(26, sp * 0.03);

      alpha = (alpha + glow * 0.5) * p;
      if (alpha < 0.03) { bucket[i] = -1; continue; }

      const blue = Math.max(smooth(0.25, 0.7, s), glow * 0.9, clamp01(sp / 900) * 0.6);
      const ai = Math.min(A_LEVELS - 1, Math.floor(clamp01(alpha) * A_LEVELS));
      const bi = Math.round(blue * (B_LEVELS - 1));
      const b = ai * B_LEVELS + bi;
      bucket[i] = b; counts[b]++;
      const hl = len / 2, o = i * 4;
      seg[o] = x - dx * hl; seg[o + 1] = y - dy * hl; seg[o + 2] = x + dx * hl; seg[o + 3] = y + dy * hl;
    }

    // batched draw
    ctx.lineWidth = 2; ctx.lineCap = 'butt';
    for (let b = 0; b < counts.length; b++) {
      if (!counts[b]) continue;
      ctx.strokeStyle = PALETTE[b];
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (bucket[i] !== b) continue;
        const o = i * 4;
        ctx.moveTo(seg[o], seg[o + 1]); ctx.lineTo(seg[o + 2], seg[o + 3]);
      }
      ctx.stroke();
    }

    // event horizon: soft blue halo, black core, thin ring
    if (st > 0.01) {
      const r = 72 * st;
      let g = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 2);
      g.addColorStop(0, `rgba(168,85,247,${0.35 * st})`); g.addColorStop(1, 'rgba(168,85,247,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r * 2, 0, 6.2832); ctx.fill();
      g = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      g.addColorStop(0, '#000'); g.addColorStop(0.6, 'rgba(0,0,0,.96)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = `rgba(244,114,182,${0.6 * st})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(mx, my, 22 * st, 0, 6.2832); ctx.stroke();
    }
  };
}

customElements.define('ui-bars', UiBars);
})();
