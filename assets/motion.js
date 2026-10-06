/* Motion is progressive enhancement: content and hit areas stay usable without it. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollFrame = 0;
  const updateProgress = () => {
    scrollFrame = 0;
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0})`;
    header?.classList.toggle('motion-scrolled', scrollY > 24);
  };
  const scheduleProgress = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); };
  addEventListener('scroll', scheduleProgress, {passive: true});
  addEventListener('resize', scheduleProgress, {passive: true});
  addEventListener('load', scheduleProgress, {once: true});
  if (window.ResizeObserver) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();
  if (!Element.prototype.animate || !window.IntersectionObserver) return;
  const active = new Map(), seen = new WeakSet();
  const targets = '.ad-card, .feature-ad, .service-card, .match-card, main h2, .doc-head h1, .ad-category-heading, .editorial-art, .guide-tile, .depth-links > a, .selection-grid > article, .reading-cards > *, .reader-shortcuts, .calc-inputs, .calc-result, .faq-list details, .footer-column, .match-form fieldset, .quote-card';
  const animate = (element, frames, {duration = 650, delay = 0} = {}) => {
    if (!element || preference.matches || document.hidden || !element.isConnected || element.contains(document.activeElement)) return;
    active.get(element)?.cancel();
    const animation = element.animate(frames, {duration, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards'});
    active.set(element, animation);
    const finish = () => { if (active.get(element) === animation) active.delete(element); };
    animation.onfinish = finish; animation.oncancel = finish;
  };
  const fade = (element, delay = 0, duration = 650) => animate(element, [{opacity: .12}, {opacity: 1}], {delay, duration});
  const reveal = (element, delay = 0) => {
    if (element.matches('.editorial-art')) {
      animate(element, [{opacity: .1, transform: 'translateY(12px) rotate(-3deg)'}, {opacity: 1, transform: 'translateY(0) rotate(0deg)'}], {duration: 850, delay});
      return;
    }
    // Translate only text-only headings; never move a link, input or click target.
    if (element.matches('h1, h2, .ad-category-heading') && !element.querySelector('a, button, input')) {
      animate(element, [{opacity: .12, transform: 'translateY(22px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 720, delay});
    } else fade(element, delay);
  };
  const observer = new IntersectionObserver(entries => {
    let position = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      reveal(entry.target, Math.min(position++ * 85, 255));
    }
  }, {threshold: .08});
  const discover = (root, initial = false) => {
    root.querySelectorAll(targets).forEach(element => {
      if (seen.has(element)) return;
      seen.add(element);
      // Avoid nested fades and leave restored/hash-linked viewport content untouched.
      if (element.parentElement?.closest(targets)) return;
      const bounds = element.getBoundingClientRect();
      if (initial && bounds.top < innerHeight && bounds.bottom > 0) {
        if (scrollY < 40 && element.matches('h1, h2, .editorial-art')) reveal(element, 80);
        return;
      }
      observer.observe(element);
    });
  };
  discover(document, true);
  // Fade the intact artwork, not individual pixels or hotspots. No zoom/cropping.
  const hero = document.querySelector('.reference-hero-image');
  if (hero && scrollY < 40) {
    const introduce = () => { if (scrollY < 40) fade(hero, 0, 900); };
    if (hero.complete) introduce(); else hero.addEventListener('load', introduce, {once: true});
  }
  for (const selector of ['#service-list', '#match-results', '#comparison-table']) {
    const region = document.querySelector(selector);
    if (!region) continue;
    new MutationObserver(() => {
      if (selector === '#comparison-table') {
        region.querySelectorAll('tbody tr').forEach((row, i) => fade(row, Math.min(i * 35, 175), 360));
      } else discover(region);
    }).observe(region, {childList: true, subtree: true});
  }
  // Real calculated values are updated instantly; only their presentation pulses.
  for (const output of document.querySelectorAll('#receipt, [data-quote-output], #selected-count')) {
    new MutationObserver(() => animate(output, [
      {opacity: .4, transform: 'translateY(4px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 360})).observe(output, {childList: true, characterData: true, subtree: true});
  }
  document.addEventListener('toggle', event => {
    if (!event.target.matches('details') || !event.target.open) return;
    [...event.target.children].filter(child => child.tagName !== 'SUMMARY').forEach((child, i) => fade(child, Math.min(i * 45, 135), 330));
  }, true);
  document.addEventListener('change', event => {
    const field = event.target.closest('#match-form fieldset');
    if (field) animate(field.querySelector('legend'), [{opacity: .4, transform: 'translateX(5px)'}, {opacity: 1, transform: 'translateX(0)'}], {duration: 350});
  });
  const quotes = document.querySelector('#quote-panel');
  if (quotes) new MutationObserver(() => { if (!quotes.hidden) quotes.querySelectorAll('.quote-card').forEach((card, i) => fade(card, i * 80)); }).observe(quotes, {attributes: true, attributeFilter: ['hidden']});
  const cancelAll = () => { active.forEach(animation => animation.cancel()); active.clear(); };
  preference.addEventListener('change', () => { if (preference.matches) cancelAll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAll(); });
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => { if (element.contains(event.target)) animation.cancel(); });
  });
})();
