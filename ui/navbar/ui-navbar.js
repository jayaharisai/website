/**
 * <ui-navbar brand="Name" href="/"></ui-navbar>
 * Content comes from the `menu` property:
 *   navbar.menu = [{ label, all?, feature?: { art, kicker, title, desc, cta, href }, items: [{ title, desc, href }] }]
 */
(() => {
'use strict';
const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
  :host {
    --e: cubic-bezier(.22,1,.36,1);
    --water: cubic-bezier(.34,1.35,.5,1);   /* settles with a gentle overshoot */
    --bar: #1a1a1af2;
    position: fixed; inset: 12px 12px auto; z-index: 50;
    max-width: 560px; margin-inline: auto;
    opacity: 0; transform: translateY(-24px);
  }
  :host([ready]) { animation: drop .8s var(--e) forwards; }
  /* theme="pro": same component, cooler blue/indigo palette for the reading pages */
  :host([theme="pro"]) .bar { filter: hue-rotate(-62deg) saturate(.9); }
  :host([theme="pro"]) .panel-inner { box-shadow: 0 22px 36px -22px #0f172ab3, 0 0 0 1px #0f172a40; }
  @keyframes drop { to { opacity: 1; transform: none; } }

  .bar {
    position: relative; display: flex; align-items: center; gap: 24px;
    height: 64px; padding: 0 10px 0 22px;
    background: var(--bar); border-radius: 14px; border: 1px solid #ffffff14;
    transition: height .35s var(--e), box-shadow .35s;
  }
  :host([scrolled]) .bar { height: 56px; box-shadow: 0 10px 40px #0009; }

  .brand { display: flex; align-items: center; color: #fff; text-decoration: none; border-radius: 8px; }
  .name { display: inline-flex; align-items: baseline; font-family: "Space Grotesk", system-ui, sans-serif;
    font-size: 25px; font-weight: 700; letter-spacing: -.045em; line-height: 1; }
  .name .b2 { margin-left: 2px; font-family: "Instrument Serif", Georgia, serif; font-style: italic; font-weight: 400;
    font-size: 1.38em; letter-spacing: -.01em;
    background: linear-gradient(100deg, #f5d0fe, #c084fc 55%, #f472b6); background-size: 200% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent; transition: background-position .6s var(--e); }
  .brand:hover .b2 { background-position: 100% 0; }
  .name::after { content: ""; width: 5px; height: 5px; margin-left: 3px; border-radius: 50%; background: #e879f9;
    box-shadow: 0 0 8px #e879f9; animation: blink 2.6s ease-in-out infinite; }
  @keyframes blink { 50% { opacity: .35; box-shadow: 0 0 2px #e879f9; } }

  .menu { display: flex; align-items: center; margin-left: auto; }
  .links { display: flex; align-items: center; gap: 2px; }
  .pill {
    position: absolute; top: 50%; left: 0; height: 38px; width: var(--w, 0); border-radius: 9px;
    background: linear-gradient(180deg, #c084fc33, #a855f71a); box-shadow: inset 0 0 0 1px #e879f926, 0 0 24px #a855f72e;
    opacity: 0; pointer-events: none;
    transform: translate(var(--x, 0), -50%);
    transition: transform .3s var(--e), width .3s var(--e), opacity .2s;
  }
  .links.hovering .pill { opacity: 1; }
  .pill.snap { transition: none; }

  .group { display: flex; }
  .trigger {
    position: relative; display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 14px; border: 0; border-radius: 9px; background: none; cursor: pointer;
    color: #fff; font-family: inherit; font-size: 15px; font-weight: 500; line-height: 1;
  }
  .trigger svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2.2;
    stroke-linecap: round; stroke-linejoin: round; transition: transform .4s var(--e); opacity: .7; }
  .is-open .trigger svg { transform: rotate(180deg); opacity: 1; }
  .trigger[data-current], .is-open .trigger { color: var(--accent-hover, #c084fc); }

  a:focus-visible, button:focus-visible { outline: 2px solid var(--accent-hover, #c084fc); outline-offset: 2px; }

  /* ---------- dropdown panel (desktop): a liquid blue sheet that flows out of the bar ---------- */
  .panel {
    position: absolute; top: calc(100% + 8px); left: 50%; width: min(780px, calc(100vw - 24px)); transform: translateX(-50%);
    opacity: 0; visibility: hidden;
    transition: visibility 0s .22s;
  }
  .is-open .panel { opacity: 1; visibility: visible; transition-delay: 0s; }
  .panel-inner {
    position: relative; overflow: hidden; isolation: isolate;
    background: linear-gradient(165deg, #3b1070 0%, #1a0b36 38%, #0c0716 100%);
    border: 1px solid #c084fc40; border-radius: 20px;
    box-shadow: 0 24px 60px #000d, 0 0 0 1px #00000080;
    clip-path: inset(0 -60px 100% -60px round 20px);
    transition: clip-path .22s cubic-bezier(.4,0,1,1);
  }
  .is-open .panel-inner { clip-path: inset(0 -60px -80px -60px round 20px); transition: clip-path .34s var(--e); }
  .panel-inner::before, .panel-inner::after {      /* drifting liquid light */
    content: ""; position: absolute; z-index: -1; width: 340px; height: 340px; border-radius: 50%;
    filter: blur(40px); opacity: .55; pointer-events: none;
  }
  .panel-inner::before { left: -90px; top: -140px; background: #a855f7; animation: drift1 9s ease-in-out infinite alternate; }
  .panel-inner::after  { right: -110px; bottom: -190px; background: #ec4899; opacity: .32; animation: drift2 11s ease-in-out infinite alternate; }
  @keyframes drift1 { to { transform: translate(190px, 70px) scale(1.2); } }
  @keyframes drift2 { to { transform: translate(-170px, -50px) scale(1.15); } }
  .glow {                                           /* follows the cursor, trails like water */
    position: absolute; z-index: -1; left: -150px; top: -150px; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, #e879f955, #a855f722 45%, transparent 70%);
    opacity: 0; transition: transform .35s var(--e), opacity .25s; pointer-events: none;
  }
  .panel-inner:hover .glow { opacity: 1; }
  .none { margin: 8px 10px 4px; font-size: 14px; color: #c9b8e8; }
  .wrap { position: relative; display: grid; grid-template-columns: 1.05fr .95fr; gap: 14px; padding: 14px; }
  .wrap.solo { grid-template-columns: 1fr; }

  /* list */
  .list { display: flex; flex-direction: column; padding: 4px 0 0 6px; min-width: 0; }
  .item {
    position: relative; display: flex; align-items: center; gap: 14px; padding: 11px 10px; border-radius: 12px;
    color: #fff; text-decoration: none;
    opacity: 0; transform: translateX(-10px); transition: opacity .12s, transform .12s, background .2s;
  }
  .is-open .item {
    opacity: 1; transform: none; transition: opacity .22s, transform .3s var(--e), background .2s;
    transition-delay: calc(var(--i) * 22ms + 30ms), calc(var(--i) * 22ms + 30ms), 0s;
  }
  .item:hover, .item:focus-visible { background: #ffffff0d; }
  .num { flex: none; width: 22px; font: 500 11px/1 "JetBrains Mono", ui-monospace, Menlo, monospace; color: #a78bfa; transition: color .2s; }
  .item:hover .num, .item:focus-visible .num { color: #f472b6; }
  .txt { display: grid; gap: 3px; min-width: 0; flex: 1; transition: transform .35s var(--e); }
  .item:hover .txt, .item:focus-visible .txt { transform: translateX(4px); }
  .txt strong {
    justify-self: start; padding-bottom: 2px; font-size: 15px; font-weight: 600;
    background: linear-gradient(90deg, #f0abfc, #f472b6) no-repeat 0 100% / 0 1.5px; transition: background-size .35s var(--e);
  }
  .item:hover strong, .item:focus-visible strong { background-size: 100% 1.5px; }
  .txt small { font-size: 12.5px; line-height: 1.35; color: #c9b8e8; }
  .arrow { flex: none; width: 16px; height: 16px; stroke: #f472b6; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    opacity: 0; transform: translateX(-8px); transition: opacity .2s, transform .35s var(--e); }
  .item:hover .arrow, .item:focus-visible .arrow { opacity: 1; transform: none; }
  .item[aria-current="true"] .num { color: #f472b6; }
  .all { margin: 6px 0 0 10px; align-self: flex-start; padding: 8px 0; color: #f0abfc; text-decoration: none;
    font: 500 12px/1 "JetBrains Mono", ui-monospace, Menlo, monospace; letter-spacing: .02em; }
  .all:hover { color: #fff; }

  /* featured card with artwork */
  .feature {
    position: relative; display: flex; align-items: flex-end; min-height: 300px; overflow: hidden; border-radius: 16px;
    color: #fff; text-decoration: none; border: 1px solid #f0abfc2e; background: #0c0716;
    opacity: 0; transform: translateY(10px) scale(.98); transition: opacity .12s, transform .12s;
  }
  .is-open .feature { opacity: 1; transform: none; transition: opacity .3s .08s, transform .45s var(--e) .08s; }
  .slide { position: absolute; inset: 0; display: flex; align-items: flex-end; opacity: 0; transition: opacity .38s; }
  .slide.on { opacity: 1; }
  .slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, #0c0716f2 8%, #0c071600 62%); }
  .art { position: absolute; inset: 0; --s: 1.18; transition: transform 1s var(--e);
    transform: translate(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -10px)) scale(var(--s)); }
  .slide.on .art { --s: 1.06; }
  .slide .fx { opacity: 0; transform: translateY(10px); transition: opacity .2s, transform .2s; }
  .slide.on .fx { opacity: 1; transform: none; transition: opacity .4s .12s, transform .5s var(--e) .12s; }
  .slide:not(.on) .art *, .group:not(.is-open) .art * { animation-play-state: paused; }
  .art svg { width: 100%; height: 100%; display: block; }
  .fx { position: relative; z-index: 1; display: grid; gap: 7px; padding: 18px; }
  .kicker { justify-self: start; padding: 5px 9px; border-radius: 999px; background: #ffffff14; border: 1px solid #ffffff1f;
    font: 500 10.5px/1 "JetBrains Mono", ui-monospace, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: #f5d0fe; }
  .fx strong { font-family: "Instrument Serif", Georgia, serif; font-style: italic; font-weight: 400; font-size: 27px; line-height: 1.05; letter-spacing: -.01em; }
  .fx p { margin: 0; font-size: 12.5px; line-height: 1.45; color: #d9c9f3; }
  .cta { font-size: 13px; font-weight: 600; color: #f472b6; transition: transform .3s var(--e); justify-self: start; }
  .feature:hover .cta { transform: translateX(4px); }

  /* artwork animation */
  .node { fill: #f0abfc; animation: node 3.2s ease-in-out infinite; animation-delay: var(--d, 0s); transform-box: fill-box; transform-origin: center; }
  @keyframes node { 50% { opacity: .35; transform: scale(.7); } }
  .flow { stroke-dasharray: 3 9; animation: flow 1.6s linear infinite; }
  @keyframes flow { to { stroke-dashoffset: -24; } }
  .ring { animation: spin var(--t, 14s) linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .draw { stroke-dasharray: 280; stroke-dashoffset: 280; animation: draw 4s ease-in-out infinite; }
  @keyframes draw { 0% { stroke-dashoffset: 280; } 55%, 100% { stroke-dashoffset: 0; } }
  .sway { animation: sway 7s ease-in-out infinite alternate; animation-delay: var(--d, 0s); }
  @keyframes sway { to { transform: translateX(34px); } }
  .float { animation: float 5s ease-in-out infinite alternate; animation-delay: var(--d, 0s); }
  @keyframes float { to { transform: translateY(-9px); } }
  .scan { animation: scan 3.4s linear infinite; }
  @keyframes scan { from { transform: translateY(0); } to { transform: translateY(300px); } }
  .grow { transform-box: fill-box; transform-origin: left center; animation: grow 3s ease-in-out infinite alternate; animation-delay: var(--d, 0s); }
  @keyframes grow { from { transform: scaleX(.2); } to { transform: scaleX(1); } }
  .pr { transform-box: fill-box; transform-origin: center; animation: pr 2.4s ease-out infinite; }
  @keyframes pr { from { transform: scale(.4); opacity: .9; } to { transform: scale(2); opacity: 0; } }
  .twinkle { animation: node 2.6s ease-in-out infinite; animation-delay: var(--d, 0s); transform-box: fill-box; transform-origin: center; }

  /* ---------- mobile ---------- */
  .toggle { display: none; margin-left: auto; width: 44px; height: 44px; border: 0; border-radius: 8px;
    background: transparent; cursor: pointer; color: #fff; place-items: center; }
  .toggle:hover { background: #ffffff14; }
  .toggle span, .toggle span::before { display: block; width: 20px; height: 2px; background: currentColor;
    border-radius: 2px; transition: transform .3s var(--e); }
  .toggle span { position: relative; transform: translateY(-3px); }
  .toggle span::before { content: ""; position: absolute; top: 6px; }
  :host([open]) .toggle span { transform: translateY(3px) rotate(45deg); }
  :host([open]) .toggle span::before { transform: translateY(-6px) rotate(-90deg); }

  @media (max-width: 760px) {
    .toggle { display: grid; }
    .menu {
      position: absolute; top: calc(100% + 8px); left: 0; right: 0; margin: 0; padding: 8px;
      max-height: calc(100dvh - 110px); overflow: auto;
      background: #141414fa; border: 1px solid #ffffff14; border-radius: 14px;
      opacity: 0; visibility: hidden; transform: translateY(-8px) scale(.98); transform-origin: top;
      transition: opacity .25s, transform .4s var(--e), visibility .4s;
    }
    :host([open]) .menu { opacity: 1; visibility: visible; transform: none; }
    .links { flex-direction: column; align-items: stretch; width: 100%; }
    .pill { display: none; }
    .group { flex-direction: column; }
    .trigger { justify-content: space-between; padding: 14px 12px; font-size: 16px; }

    .panel {
      position: static; width: auto; transform: none; display: grid; grid-template-rows: 0fr; filter: none;
      opacity: 1; visibility: visible; transition: grid-template-rows .3s var(--e);
    }
    .is-open .panel { grid-template-rows: 1fr; }
    .panel-inner {
      overflow: hidden; min-height: 0; visibility: hidden; transition: visibility 0s .5s;
      background: none; border: 0; border-radius: 0; box-shadow: none; clip-path: none; transform: none; isolation: auto;
    }
    .panel-inner::before, .panel-inner::after, .glow { display: none; }
    .is-open .panel-inner { visibility: visible; transition-delay: 0s; }
    .wrap { grid-template-columns: 1fr; padding: 0 0 8px; }
    .feature { display: none; }
    .list { padding: 0; }
    .arrow { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    :host, :host([ready]) { animation: none; opacity: 1; transform: none; }
    * { transition-duration: 0s !important; transition-delay: 0s !important; }
    .art * { animation: none !important; }
  }
</style>

<nav class="bar" aria-label="Primary">
  <a class="brand">
    <span class="name"></span>
  </a>
  <button class="toggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="menu"><span></span></button>
  <div class="menu" id="menu"><div class="links"><i class="pill"></i></div></div>
</nav>`;


const NS = 'http://www.w3.org/2000/svg';
const defs = (id) => `<defs>
  <radialGradient id="${id}-bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#6d28d9"/><stop offset=".55" stop-color="#2e1065"/><stop offset="1" stop-color="#0c0716"/></radialGradient>
  <radialGradient id="${id}-core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#f472b6"/><stop offset="1" stop-color="#a855f700"/></radialGradient>
  <linearGradient id="${id}-ln" x1="0" x2="1"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#f472b6"/></linearGradient>
  <filter id="${id}-gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
</defs><rect width="300" height="340" fill="url(#${id}-bg)"/>`;

const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const wrapSvg = (id, body) => `<svg viewBox="0 0 300 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs(id)}${body}</svg>`;
const star = (x, y, sc, d) => `<path class="twinkle" style="--d:${d}s" transform="translate(${x} ${y}) scale(${sc})" d="M0-9L2.2-2.2 9 0 2.2 2.2 0 9-2.2 2.2-9 0-2.2-2.2Z" fill="#f5d0fe"/>`;
const spark = (n, seed) => { const r = rng(seed); return Array.from({ length: n }, () => `<circle class="twinkle" style="--d:${(r() * 3).toFixed(2)}s" cx="${(r() * 290 + 5) | 0}" cy="${(r() * 330 + 5) | 0}" r="${(r() * 1.2 + .6).toFixed(1)}" fill="#f5d0fe"/>`).join(''); };

const ART = {
  /* Machine Learning: two clusters and a boundary that draws itself */
  ml(id) {
    const r = rng(7); let pts = '';
    for (let i = 0; i < 15; i++) pts += `<circle class="node" style="--d:${(r() * 3).toFixed(2)}s" cx="${(90 + (r() - .5) * 95) | 0}" cy="${(105 + (r() - .5) * 95) | 0}" r="4.5" fill="#c084fc"/>`;
    for (let i = 0; i < 15; i++) pts += `<circle class="node" style="--d:${(r() * 3).toFixed(2)}s" cx="${(210 + (r() - .5) * 95) | 0}" cy="${(200 + (r() - .5) * 95) | 0}" r="4.5" fill="#f472b6"/>`;
    const grid = [60, 120, 180, 240].map((v) => `<line x1="${v}" y1="20" x2="${v}" y2="320" stroke="#fff" stroke-opacity=".06"/><line x1="20" y1="${v + 30}" x2="280" y2="${v + 30}" stroke="#fff" stroke-opacity=".06"/>`).join('');
    return wrapSvg(id, `${grid}${pts}<path class="draw" d="M40 240 C110 190 170 120 262 70" fill="none" stroke="url(#${id}-ln)" stroke-width="2.5" stroke-linecap="round"/>`);
  },
  /* Generative AI: drifting aurora and sparkles */
  gen(id) {
    const wave = (y, c, o, d) => `<g class="sway" style="--d:${d}s"><path d="M-60 ${y} C 10 ${y - 70} 80 ${y + 60} 150 ${y} S 280 ${y - 60} 360 ${y}" fill="none" stroke="${c}" stroke-width="30" stroke-linecap="round" opacity="${o}" filter="url(#${id}-gl)"/></g>`;
    return wrapSvg(id, `${wave(110, '#c084fc', .6, 0)}${wave(165, '#f472b6', .55, -2)}${wave(220, '#818cf8', .5, -4)}${spark(14, 3)}${star(70, 80, 1.3, 0)}${star(230, 130, 1, .8)}${star(120, 210, 1.5, 1.6)}${star(220, 250, .9, 2.2)}`);
  },
  /* Deep Learning: layered network with data flowing */
  dl(id) {
    const layers = [[0.5, 0.25], [0.18, 0.4, 0.62, 0.82], [0.12, 0.34, 0.56, 0.78], [0.35, 0.65]];
    const xs = [48, 110, 190, 252], H = 300, top = 20;
    let lines = '', nodes = '', k = 0;
    layers.forEach((ys, li) => {
      if (li < layers.length - 1) ys.forEach((y1) => layers[li + 1].forEach((y2) => {
        lines += `<line class="flow" style="animation-delay:-${(k++ % 7) * 0.23}s" x1="${xs[li]}" y1="${top + y1 * H}" x2="${xs[li + 1]}" y2="${top + y2 * H}" stroke="url(#${id}-ln)" stroke-opacity=".5" stroke-width="1.2"/>`;
      }));
      ys.forEach((y, ni) => { nodes += `<circle class="node" style="--d:${((li * 5 + ni * 3) % 9) * 0.35}s" cx="${xs[li]}" cy="${top + y * H}" r="${li === 0 || li === 3 ? 6 : 5}"/>`; });
    });
    return wrapSvg(id, `<circle cx="150" cy="150" r="90" fill="#c026d3" opacity=".25" filter="url(#${id}-gl)"/>${lines}${nodes}`);
  },
  /* NLP: tokens linked by attention arcs */
  nlp(id) {
    const w = [['the', 40, 64], ['model', 120, 100], ['learns', 52, 146], ['from', 170, 170], ['language', 70, 206], ['tokens', 150, 40]];
    const chips = w.map(([t, x, y], i) => `<g class="float" style="--d:-${i * .8}s"><rect x="${x}" y="${y}" width="${t.length * 8 + 22}" height="26" rx="13" fill="#ffffff14" stroke="#f0abfc" stroke-opacity=".5"/><text x="${x + 11}" y="${y + 17}" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d0fe">${t}</text></g>`).join('');
    const arc = (x1, y1, x2, y2, c) => `<path class="flow" d="M${x1} ${y1} Q ${c} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" stroke="url(#${id}-ln)" stroke-width="1.4"/>`;
    return wrapSvg(id, `${arc(62, 90, 140, 100, 50)}${arc(150, 126, 95, 146, 170)}${arc(100, 172, 172, 170, 130)}${arc(185, 196, 130, 206, 190)}${arc(185, 66, 170, 100, 230)}${chips}${spark(8, 11)}`);
  },
  /* Computer Vision: pixels, a detection box and a scan line */
  cv(id) {
    const r = rng(21); let px = '';
    for (let y = 0; y < 14; y++) for (let x = 0; x < 11; x++) px += `<rect x="${12 + x * 25}" y="${10 + y * 24}" width="21" height="20" rx="3" fill="${r() > .5 ? '#c084fc' : '#f472b6'}" opacity="${(r() * .28 + .04).toFixed(2)}"/>`;
    return wrapSvg(id, `${px}
      <g class="float" style="--d:-1s"><rect x="82" y="86" width="136" height="120" rx="8" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="14 8"/>
      <rect x="82" y="64" width="86" height="20" rx="6" fill="#f472b6"/><text x="90" y="78" font-family="JetBrains Mono, monospace" font-size="11" fill="#1a0b36">object 0.98</text></g>
      <rect class="scan" x="0" y="10" width="300" height="3" fill="#f0abfc" opacity=".8"/><rect class="scan" x="0" y="-26" width="300" height="38" fill="url(#${id}-ln)" opacity=".18"/>`);
  },
  /* Reinforcement Learning: an agent finds its way to the reward */
  rl(id) {
    let cells = '';
    for (let y = 0; y < 7; y++) for (let x = 0; x < 6; x++) cells += `<rect x="${24 + x * 42}" y="${34 + y * 42}" width="38" height="38" rx="6" fill="#ffffff0a" stroke="#fff" stroke-opacity=".08"/>`;
    const walls = [[1, 1], [1, 2], [3, 2], [3, 3], [2, 5], [4, 4], [4, 5]].map(([x, y]) => `<rect x="${24 + x * 42}" y="${34 + y * 42}" width="38" height="38" rx="6" fill="#4c1d95" opacity=".85"/>`).join('');
    const path = 'M43 53 L43 137 L85 137 L85 179 L127 179 L127 95 L211 95 L211 263';
    return wrapSvg(id, `${cells}${walls}<path class="draw" d="${path}" fill="none" stroke="url(#${id}-ln)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:640;stroke-dashoffset:640"/>
      <circle cx="43" cy="53" r="7" fill="#f0abfc"><animateMotion dur="4s" repeatCount="indefinite" path="${path}"/></circle>${star(211, 263, 1.7, 0)}<circle class="pr" cx="211" cy="263" r="14" fill="none" stroke="#f472b6"/>`);
  },
  /* Agent Harness: a loop of plan, act, check around a core */
  harness(id) {
    const chip = (t, x, y) => `<g class="float" style="--d:-${(x + y) % 4}s"><rect x="${x - 30}" y="${y - 12}" width="60" height="24" rx="12" fill="#1a0b36" stroke="#f0abfc" stroke-opacity=".6"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#f5d0fe">${t}</text></g>`;
    return wrapSvg(id, `${spark(10, 5)}<g transform="translate(150 134) scale(.8) translate(-150 -150)"><g transform="translate(150 150)">
      <circle class="ring" style="--t:30s" r="100" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>
      <circle class="ring" style="--t:20s;animation-direction:reverse" r="72" fill="none" stroke="#c084fc" stroke-opacity=".6" stroke-width="1.5" stroke-dasharray="40 14"/></g>
      <circle cx="150" cy="150" r="44" fill="url(#${id}-core)" filter="url(#${id}-gl)"/>
      <rect x="122" y="130" width="56" height="40" rx="12" fill="#2e1065" stroke="#f0abfc" stroke-width="1.5"/><text x="150" y="155" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#fff">model</text>
      ${chip('plan', 150, 50)}${chip('act', 250, 150)}${chip('check', 150, 250)}${chip('tools', 50, 150)}</g>`);
  },
  /* RAG: a glowing core with orbiting documents */
  rag(id) {
    const rings = [[48, '10s', '#f0abfc', 5, ''], [82, '16s', '#f472b6', 6, 'animation-direction:reverse'], [118, '24s', '#c084fc', 4.5, '']];
    return wrapSvg(id, `${spark(16, 9)}<g transform="translate(150 150) rotate(-22) scale(1 .5)">
        ${rings.map(([r, t, c, d, st]) => `<g class="ring" style="--t:${t};${st}"><circle r="${r}" fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="1.2"/><circle cx="${r}" r="${d}" fill="${c}"/></g>`).join('')}
      </g><circle cx="150" cy="150" r="46" fill="url(#${id}-core)" filter="url(#${id}-gl)"/><circle cx="150" cy="150" r="14" fill="url(#${id}-core)"/>`);
  },
  /* Hybrid RAG: keyword grid meets vector cloud, then rank */
  hybrid(id) {
    const r = rng(33); let dots = '', grid = '';
    for (let i = 0; i < 16; i++) dots += `<circle class="node" style="--d:${(r() * 3).toFixed(2)}s" cx="${(185 + (r() - .5) * 90) | 0}" cy="${(130 + (r() - .5) * 90) | 0}" r="3.5" fill="#f472b6"/>`;
    for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) grid += `<rect x="${72 + x * 17}" y="${86 + y * 17}" width="11" height="11" rx="2" fill="#c084fc" opacity="${((x + y) % 3 ? .25 : .6)}"/>`;
    const bar = (y, w, d) => `<rect x="40" y="${y}" width="220" height="9" rx="4.5" fill="#ffffff12"/><rect class="grow" style="--d:-${d}s" x="40" y="${y}" width="${w}" height="9" rx="4.5" fill="url(#${id}-ln)"/>`;
    return wrapSvg(id, `<g transform="translate(12 -46) scale(.92)"><circle cx="112" cy="130" r="70" fill="#a855f7" opacity=".16" stroke="#c084fc" stroke-opacity=".6"/><circle cx="188" cy="130" r="70" fill="#ec4899" opacity=".16" stroke="#f472b6" stroke-opacity=".6"/>
      ${grid}${dots}<ellipse cx="150" cy="130" rx="22" ry="62" fill="#fff" opacity=".12"/></g>${bar(158, 210, 0)}${bar(176, 150, 1)}${bar(194, 96, 2)}`);
  },
  /* Embeddings: meaning as coordinates, clusters of neighbours */
  embed(id) {
    const r = rng(41); let pts = '';
    [[90, 110, '#c084fc'], [205, 90, '#f472b6'], [170, 215, '#818cf8']].forEach(([cx, cy, c]) => {
      for (let i = 0; i < 11; i++) pts += `<circle class="node" style="--d:${(r() * 3).toFixed(2)}s" cx="${(cx + (r() - .5) * 64) | 0}" cy="${(cy + (r() - .5) * 64) | 0}" r="3.8" fill="${c}"/>`;
      pts += `<line x1="30" y1="290" x2="${cx}" y2="${cy}" stroke="${c}" stroke-opacity=".5" stroke-width="1.3" class="flow"/>`;
    });
    return wrapSvg(id, `<path d="M30 290 H280 M30 290 V30" stroke="#fff" stroke-opacity=".25" fill="none"/><path d="M30 290 L8 312" stroke="#fff" stroke-opacity=".25"/>${pts}`);
  },
  /* Vector DB: layered space and a nearest-neighbour pulse */
  vdb(id) {
    const r = rng(55); let planes = '';
    [0, 1, 2].forEach((i) => {
      const y = 100 + i * 64;
      planes += `<polygon points="150,${y - 46} 270,${y} 150,${y + 46} 30,${y}" fill="#a855f7" fill-opacity="${.1 + i * .06}" stroke="#f0abfc" stroke-opacity="${.3 + i * .15}"/>`;
      for (let k = 0; k < 6; k++) planes += `<circle class="node" style="--d:${(r() * 3).toFixed(2)}s" cx="${(90 + r() * 120) | 0}" cy="${(y - 14 + r() * 28) | 0}" r="3" fill="#f5d0fe"/>`;
    });
    return wrapSvg(id, `${planes}<line x1="150" y1="20" x2="150" y2="228" stroke="#f472b6" stroke-dasharray="4 6" class="flow"/><circle cx="150" cy="228" r="6" fill="#f472b6"/><circle class="pr" cx="150" cy="228" r="16" fill="none" stroke="#f472b6" stroke-width="2"/>${star(150, 22, 1.4, 0)}`);
  },
  /* MCP: one hub, many tools, signals travelling */
  mcp(id) {
    const n = 6; let spokes = '', nodes = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2, x = 150 + Math.cos(a) * 105, y = 160 + Math.sin(a) * 105;
      spokes += `<line x1="150" y1="160" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="url(#${id}-ln)" stroke-opacity=".6" stroke-width="1.5"/>
        <circle r="3.5" fill="#fff"><animateMotion dur="${2 + (i % 3) * .6}s" begin="-${i * .4}s" repeatCount="indefinite" path="M150 160 L${x.toFixed(1)} ${y.toFixed(1)}"/></circle>`;
      nodes += `<g class="float" style="--d:-${i * .7}s"><rect x="${(x - 17).toFixed(1)}" y="${(y - 17).toFixed(1)}" width="34" height="34" rx="10" fill="#1a0b36" stroke="#f0abfc" stroke-opacity=".7"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#f472b6"/></g>`;
    }
    return wrapSvg(id, `${spark(10, 13)}<g transform="translate(150 128) scale(.82) translate(-150 -160)">${spokes}${nodes}<circle cx="150" cy="160" r="34" fill="url(#${id}-core)" filter="url(#${id}-gl)"/><circle cx="150" cy="160" r="18" fill="#2e1065" stroke="#fff" stroke-width="1.5"/></g>`);
  },
};
const arrowSvg = () => {
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 16 16'); s.setAttribute('aria-hidden', 'true'); s.classList.add('arrow');
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M3 8h10M9 4l4 4-4 4'); s.append(p); return s;
};
const SVG_NS = 'http://www.w3.org/2000/svg';
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
};
const chevron = () => {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 12 12'); s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', 'M2 4.5l4 4 4-4');
  s.append(p); return s;
};

class UiNavbar extends HTMLElement {
  #menu = []; #groups = []; #toggle; #links; #pill;
  #openIdx = -1; #timer = 0; #raf = 0;
  #off = [];

  set menu(v) { this.#menu = v ?? []; if (this.isConnected) this.#render(); }
  get menu() { return this.#menu; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).append(tpl.content.cloneNode(true));
    const root = this.shadowRoot;
    const brand = this.getAttribute('brand') ?? '';
    const m = brand.match(/^(.+?)([A-Z][a-z]+)$/);          // "LearNew" -> "Lear" + "New"
    const name = root.querySelector('.name');
    if (m) name.append(m[1], Object.assign(document.createElement('span'), { className: 'b2', textContent: m[2] }));
    else name.textContent = brand;
    name.setAttribute('aria-label', brand);
    root.querySelector('.brand').href = this.getAttribute('href') ?? '/';
    this.#toggle = root.querySelector('.toggle');
    this.#links = root.querySelector('.links');
    this.#pill = root.querySelector('.pill');

    const on = (t, e, f, o) => { t.addEventListener(e, f, o); this.#off.push(() => t.removeEventListener(e, f, o)); };
    on(this.#toggle, 'click', () => this.#setMenu(!this.hasAttribute('open')));
    on(window, 'keydown', (e) => {
      if (e.key !== 'Escape') return;
      const focusTrigger = this.#openIdx >= 0 ? this.#groups[this.#openIdx].trigger : this.#toggle;
      if (this.#openIdx >= 0 || this.hasAttribute('open')) { this.#closeAll(); this.#setMenu(false); focusTrigger.focus(); }
    });
    on(window, 'pointerdown', (e) => { if (!e.composedPath().includes(this)) { this.#closeAll(); this.#setMenu(false); } });
    on(window, 'scroll', () => {
      cancelAnimationFrame(this.#raf);
      this.#raf = requestAnimationFrame(() => this.toggleAttribute('scrolled', scrollY > 8));
    }, { passive: true });
    on(window, 'hashchange', () => this.#markCurrent());
    on(this.#links, 'pointerleave', () => this.#links.classList.remove('hovering'));

    this.toggleAttribute('scrolled', scrollY > 8);
    if (this.#menu.length) this.#render();

    if (document.documentElement.classList.contains('is-ready')) this.setAttribute('ready', '');
    else document.addEventListener('app:ready', () => this.setAttribute('ready', ''), { once: true });
  }

  disconnectedCallback() {
    this.#off.forEach((f) => f()); this.#off = [];
    clearTimeout(this.#timer); cancelAnimationFrame(this.#raf);
  }

  #render() {
    this.#links.querySelectorAll('.group').forEach((g) => g.remove());
    this.#groups = this.#menu.map((g, gi) => {
      const panelId = `panel-${gi}`;
      const trigger = el('button', { className: 'trigger', type: 'button' }, el('span', { textContent: g.label }), chevron());
      trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-controls', panelId);

      const items = g.items.map((it, i) => {
        const a = el('a', { className: 'item', href: it.href },
          el('span', { className: 'num', textContent: String(i + 1).padStart(2, '0') }),
          el('span', { className: 'txt' }, el('strong', { textContent: it.title }), el('small', { textContent: it.desc })),
          arrowSvg());
        a.style.setProperty('--i', i);
        return a;
      });
      const list = el('div', { className: 'list' }, ...items);
      if (!items.length) list.append(el('p', { className: 'none', textContent: "I’ve just started learning. Come back soon, and whatever I learn I’ll share here." }));
      if (g.all) {
        const all = el('a', { className: 'all', href: g.all, textContent: `Browse all ${g.label.toLowerCase()} →` });
        all.addEventListener('click', (e) => this.#leave(e, g.all));
        list.append(all);
      }

      const glow = el('i', { className: 'glow' });
      const wrap = el('div', { className: 'wrap' }, list);
      if (!g.feature || !g.items.length) wrap.style.gridTemplateColumns = '1fr';
      let feature = null, setSlide = () => {};
      if (g.feature) {
        const f = g.feature;
        const defs0 = [{ art: f.art, kicker: f.kicker, title: f.title, desc: f.desc, cta: f.cta, href: f.href }].concat(
          g.items.map((it, i) => ({ art: it.art, kicker: `${String(i + 1).padStart(2, '0')} · ${g.label}`, title: it.title, desc: it.blurb ?? it.desc, cta: 'Explore', href: it.href })));
        feature = el('a', { className: 'feature', href: f.href });
        const slides = defs0.map((d, k) => {
          const art = el('div', { className: 'art' });
          art.innerHTML = (ART[d.art] ?? ART.dl)(`a${gi}-${k}`);               // our own static markup
          const sl = el('div', { className: 'slide' + (k === 0 ? ' on' : '') }, art,
            el('div', { className: 'fx' },
              el('span', { className: 'kicker', textContent: d.kicker }),
              el('strong', { textContent: d.title }),
              el('p', { textContent: d.desc }),
              el('span', { className: 'cta', textContent: `${d.cta} →` })));
          feature.append(sl); return sl;
        });
        setSlide = (k) => {
          slides.forEach((sl, n) => sl.classList.toggle('on', n === k));
          feature.href = defs0[k].href;
        };
        items.forEach((a, i) => {
          a.addEventListener('pointerenter', () => setSlide(i + 1));
          a.addEventListener('focus', () => setSlide(i + 1));
        });
        wrap.append(feature);
      } else wrap.classList.add('solo');
      const panel = el('div', { className: 'panel', id: panelId }, el('div', { className: 'panel-inner' }, glow, wrap));
      panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', g.label);
      const group = el('div', { className: 'group' }, trigger, panel);
      this.#links.append(group);

      // interactions
      trigger.addEventListener('click', () => this.#toggleGroup(gi));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); this.#open(gi); items[0].focus(); }
      });
      group.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || this.#isMobile()) return;
        clearTimeout(this.#timer);
        this.#movePill(trigger);
        this.#timer = setTimeout(() => this.#open(gi), this.#openIdx >= 0 ? 0 : 30);
      });
      group.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse' || this.#isMobile()) return;
        clearTimeout(this.#timer);
        this.#timer = setTimeout(() => this.#close(gi), 120);
      });
      group.addEventListener('focusin', () => this.#movePill(trigger));
      group.addEventListener('focusout', (e) => {
        if (!group.contains(e.relatedTarget) && !this.#isMobile()) this.#close(gi);
      });
      panel.addEventListener('pointermove', (e) => {
        const r = panel.getBoundingClientRect();
        glow.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
        if (feature) {
          const fr = feature.getBoundingClientRect();
          feature.style.setProperty('--px', ((e.clientX - fr.left) / fr.width - 0.5).toFixed(3));
          feature.style.setProperty('--py', ((e.clientY - fr.top) / fr.height - 0.5).toFixed(3));
        }
      });
      items.forEach((a) => a.addEventListener('click', () => { this.#closeAll(); this.#setMenu(false); }));
      return { group, trigger, items, setSlide };
    });
    this.#markCurrent();
  }

  /** Fade the page out before navigating, so black -> white is a soft cross-fade, not a flash. */
  #leave(e, href) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;     // let "open in new tab" work
    e.preventDefault();
    this.#closeAll(); this.#setMenu(false);
    const veil = document.createElement('div');
    veil.id = 'veil';
    veil.style.cssText = 'position:fixed;inset:0;z-index:2000;background:#fff;opacity:0;transition:opacity .45s cubic-bezier(.22,1,.36,1)';
    document.body.append(veil);
    requestAnimationFrame(() => (veil.style.opacity = '1'));
    setTimeout(() => { location.href = href; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450);
  }

  #isMobile() { return matchMedia('(max-width: 760px)').matches; }

  #movePill(trigger) {
    const first = !this.#links.classList.contains('hovering');
    if (first) this.#pill.classList.add('snap');          // appear in place, don't slide in from the corner
    this.#pill.style.setProperty('--x', `${trigger.offsetLeft}px`);
    this.#pill.style.setProperty('--w', `${trigger.offsetWidth}px`);
    if (first) { void this.#pill.offsetWidth; this.#pill.classList.remove('snap'); }
    this.#links.classList.add('hovering');
  }

  #open(i) {
    if (i >= 0) {
      if (this.#openIdx !== i) this.#groups[i].setSlide(0);
      const t = this.#groups[i].trigger;
      this.#groups[i].group.querySelector('.panel-inner').style.setProperty('--ox', `${t.offsetLeft + t.offsetWidth / 2}px`);
    }
    this.#groups.forEach((g, gi) => {
      const o = gi === i;
      g.group.classList.toggle('is-open', o);
      g.trigger.setAttribute('aria-expanded', String(o));
    });
    this.#openIdx = i;
  }
  #close(i) { if (this.#openIdx === i) this.#closeAll(); }
  #closeAll() { this.#open(-1); }
  #toggleGroup(i) { this.#openIdx === i ? this.#closeAll() : this.#open(i); }

  #setMenu(open) {
    this.toggleAttribute('open', open);
    this.#toggle.setAttribute('aria-expanded', String(open));
    if (!open) this.#closeAll();
  }

  #markCurrent() {
    this.#groups.forEach((g) => {
      let any = false;
      g.items.forEach((a) => {
        const cur = a.getAttribute('href') === location.hash;
        a.toggleAttribute('aria-current', false);
        if (cur) { a.setAttribute('aria-current', 'true'); any = true; }
      });
      g.trigger.toggleAttribute('data-current', any);
    });
  }
}

customElements.define('ui-navbar', UiNavbar);
})();
