/* Fade-and-rise sections as they scroll into view. Without JS or with reduced motion everything is simply visible. */
(() => {
'use strict';
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
document.querySelectorAll('.body-content .sec, .body-content .pn').forEach((n) => { n.classList.add('rv'); io.observe(n); });
})();
