/* Reading pages: feed the shared navbar and fire its entrance. */
(() => {
'use strict';
const nav = document.querySelector('ui-navbar');
if (nav) nav.menu = window.LEARNEW_MENU || [];
document.dispatchEvent(new CustomEvent('app:ready'));
addEventListener('pageshow', () => document.getElementById('veil')?.remove());
})();
