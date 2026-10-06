/* Progressive enhancement: content never depends on animation to be visible. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate || !window.IntersectionObserver) return;
  const active = new Map();
  const seen = new WeakSet();
  const targets = '.ad-card, .feature-ad, .service-card, .match-card, .ad-category-heading, .ad-directory-heading, .decision-start, .editorial-illustration';
  const play = (element, distance = 14, delay = 0, duration = 460) => {
    if (preference.matches || document.hidden || !element.isConnected || element.contains(document.activeElement)) return;
    active.get(element)?.cancel();
    const frames = distance
      ? [{opacity: .25, transform: `translateY(${distance}px)`}, {opacity: 1, transform: 'translateY(0)'}]
      : [{opacity: duration === 220 ? .65 : .25}, {opacity: 1}];
    const animation = element.animate(frames, {
      duration, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards'
    });
    active.set(element, animation);
    const finish = () => { if (active.get(element) === animation) active.delete(element); };
    animation.onfinish = finish;
    animation.oncancel = finish;
  };
  const observer = new IntersectionObserver(entries => {
    let position = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const interactive = entry.target.matches('.ad-card, .feature-ad, .service-card, .match-card, .decision-start');
      play(entry.target, interactive ? 0 : 14, Math.min(position++ * 55, 165));
    }
  }, {threshold: .06});
  const discover = (root, initial = false) => {
    root.querySelectorAll(targets).forEach(element => {
      if (seen.has(element)) return;
      seen.add(element);
      // Do not animate the first viewport on load or a restored scroll position.
      const bounds = element.getBoundingClientRect();
      if (initial && bounds.top < innerHeight && bounds.bottom > 0) return;
      observer.observe(element);
    });
  };
  discover(document, true);
  // Observe only result regions, never the entire document or input attributes.
  for (const selector of ['#service-list', '#match-results', '#comparison-table']) {
    const region = document.querySelector(selector);
    if (!region) continue;
    new MutationObserver(() => {
      if (selector === '#comparison-table') play(region, 0, 0, 220);
      else discover(region);
    }).observe(region, {childList: true, subtree: true});
  }
  const cancelAll = () => { active.forEach(animation => animation.cancel()); active.clear(); };
  preference.addEventListener('change', () => { if (preference.matches) cancelAll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAll(); });
  // Keyboard navigation should never land on an animating/faded control.
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => { if (element.contains(event.target)) animation.cancel(); });
  });
})();
