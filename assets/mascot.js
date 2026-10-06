(() => {
  const button = document.querySelector('.mascot-play');
  if (!button) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const hint = document.querySelector('.mascot-hint'), status = document.querySelector('#mascot-status');
  button.disabled = false; hint.hidden = false;
  const flyer = document.createElement('div');
  flyer.className = 'roaming-mascot'; flyer.setAttribute('aria-hidden', 'true');
  flyer.append(button.querySelector('svg').cloneNode(true));
  const dock = document.createElement('div'); dock.className = 'mascot-dock'; dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', 'ナビロボの表示');
  const pause = document.createElement('button'), hide = document.createElement('button');
  pause.type = hide.type = 'button'; hide.textContent = '隠す'; hide.setAttribute('aria-label', 'ナビロボを隠す');
  dock.append(pause, hide); document.body.append(flyer, dock); document.body.classList.add('has-roaming-mascot');
  let paused = false, hidden = false, editing = false, flight = null, route = 0, scrollTimer, greetingTimer;
  let limits, initialized = false, x = 0, y = 0;
  const blockers = [...document.querySelectorAll('#tray, .result-selection-bar, .mobile-official, .consent-notice')];
  const canFly = () => !paused && !hidden && !editing && !document.hidden && !preference.matches && !!flyer.animate;
  const stopFlight = () => {
    if (flight) {
      // Freeze at the current position, not at the destination of an interrupted flight.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(flyer).transform);
      x = matrix.m41; y = matrix.m42;
      flight.onfinish = null; flight.cancel(); flight = null;
      flyer.style.transform = `translate(${x}px, ${y}px)`;
    }
    flyer.classList.remove('is-flying');
  };
  const measure = () => {
    const small = innerWidth <= 760, size = small ? 66 : 88, height = small ? 63 : 84;
    let inset = small ? 8 : 12;
    for (const blocker of blockers) {
      if (blocker.hidden || getComputedStyle(blocker).display === 'none') continue;
      const rect = blocker.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom >= innerHeight - 12 && rect.height > 0) inset = Math.max(inset, innerHeight - rect.top + 10);
    }
    dock.style.bottom = `${inset}px`;
    // Reserve the control dock and bottom CTA region; keep the flight below the header.
    const bottom = Math.max(90, innerHeight - inset - 58 - height - 14);
    limits = {left: 6, right: Math.max(6, innerWidth - size - 6), top: Math.min(bottom, Math.max(90, innerHeight * .26)), bottom};
    if (!initialized) {x = limits.right; y = limits.bottom; initialized = true;}
    x = Math.max(limits.left, Math.min(limits.right, x)); y = Math.max(limits.top, Math.min(limits.bottom, y));
    flyer.style.transform = `translate(${x}px, ${y}px)`;
  };
  const destination = () => {
    const {left, right, top, bottom} = limits;
    const stops = [[right, top], [right, bottom], [left, bottom], [left, top], [left, bottom], [right, bottom]];
    for (let i = 0; i < stops.length; i += 1) {
      const next = stops[route++ % stops.length];
      if (Math.hypot(next[0] - x, next[1] - y) > 20) return next;
    }
    return stops[0];
  };
  const fly = (target = destination()) => {
    if (!canFly()) return;
    stopFlight();
    const [tx, ty] = target, distance = Math.hypot(tx - x, ty - y);
    const duration = Math.min(8500, Math.max(2600, distance * 11));
    const lean = tx > x ? 5 : tx < x ? -5 : 0;
    flyer.classList.add('is-flying');
    flight = flyer.animate([
      {transform: `translate(${x}px, ${y}px) rotate(0deg)`},
      {transform: `translate(${(x + tx) / 2}px, ${(y + ty) / 2}px) rotate(${lean}deg)`, offset: .5},
      {transform: `translate(${tx}px, ${ty}px) rotate(0deg)`}
    ], {duration, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards'});
    flight.onfinish = () => {
      x = tx; y = ty; flyer.style.transform = `translate(${x}px, ${y}px)`;
      const done = flight; flight = null; done.onfinish = null; done.cancel();
      if (canFly()) fly();
    };
  };
  const sync = () => {
    if (!canFly()) stopFlight();
    flyer.hidden = hidden || editing || preference.matches || document.hidden;
    dock.hidden = editing;
    pause.textContent = preference.matches ? '静止表示' : paused ? '動きを再開' : '動きを止める';
    pause.disabled = hidden || preference.matches || !flyer.animate;
    pause.setAttribute('aria-pressed', String(paused));
    hide.textContent = hidden ? '表示' : '隠す'; hide.setAttribute('aria-label', hidden ? 'ナビロボを表示する' : 'ナビロボを隠す');
    if (canFly() && !flight) fly();
  };
  const stopGreeting = () => {clearTimeout(greetingTimer); button.classList.remove('is-greeting');};
  const greet = (manual = false) => {
    if (document.hidden || (!manual && (paused || hidden))) return;
    if (manual) {
      hint.textContent = 'ナビロボ、到着！'; status.textContent = 'ナビロボを呼びました。';
      hidden = false; paused = false;
      stopFlight(); measure();
      const rect = button.getBoundingClientRect();
      flyer.hidden = preference.matches;
      if (canFly()) fly([Math.max(limits.left, Math.min(limits.right, rect.right + 8)), Math.max(limits.top, Math.min(limits.bottom, rect.top))]);
      sync();
    }
    if (!preference.matches) {stopGreeting(); button.classList.add('is-greeting'); greetingTimer = setTimeout(stopGreeting, 2400);}
  };
  button.addEventListener('click', () => greet(true));
  pause.addEventListener('click', () => {paused = !paused; stopGreeting(); sync();});
  hide.addEventListener('click', () => {hidden = !hidden; stopGreeting(); sync();});
  const reflow = () => {stopFlight(); measure(); sync();};
  let resizeFrame = 0;
  const scheduleReflow = () => {if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {resizeFrame = 0; reflow();});};
  addEventListener('resize', scheduleReflow, {passive:true});
  for (const blocker of blockers) {
    new MutationObserver(scheduleReflow).observe(blocker, {attributes:true, attributeFilter:['hidden','class','style']});
    if (window.ResizeObserver) new ResizeObserver(scheduleReflow).observe(blocker);
  }
  // Change course after scrolling settles; scrolling itself is never intercepted.
  addEventListener('scroll', () => {
    clearTimeout(scrollTimer); scrollTimer = setTimeout(() => {if (canFly()) reflow();}, 240);
  }, {passive:true});
  const updateEditing = () => {
    const next = !!document.activeElement?.matches('input, select, textarea, [contenteditable="true"]');
    if (next !== editing) {editing = next; sync();}
  };
  document.addEventListener('focusin', updateEditing);
  document.addEventListener('focusout', () => setTimeout(updateEditing, 0));
  preference.addEventListener('change', () => {stopGreeting(); sync();});
  document.addEventListener('visibilitychange', () => {if (document.hidden) stopGreeting(); sync();});
  if (window.IntersectionObserver) {
    const intro = new IntersectionObserver(entries => {if (entries.some(e => e.isIntersecting)) {greet(); intro.disconnect();}}, {threshold:.65}); intro.observe(button);
  }
  measure(); sync();
})();
