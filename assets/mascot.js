(() => {
  const button = document.querySelector('.mascot-play');
  if (!button) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const hint = document.querySelector('.mascot-hint');
  const status = document.querySelector('#mascot-status');
  let timer, introductions = 0;
  button.disabled = false;
  hint.hidden = false;
  const stop = () => { clearTimeout(timer); button.classList.remove('is-greeting'); };
  const greet = (manual = false) => {
    if (document.hidden) return;
    if (manual) {
      introductions += 1;
      hint.textContent = introductions % 2 ? 'こんにちは！' : 'いっしょに選ぼう。';
      status.textContent = '案内キャラクターからのごあいさつ。';
    }
    if (preference.matches || button.classList.contains('is-greeting')) return;
    button.classList.add('is-greeting');
    timer = setTimeout(stop, 2400);
  };
  button.addEventListener('click', () => greet(true));
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { greet(); observer.disconnect(); }
    }, {threshold: .65});
    observer.observe(button);
  }
  preference.addEventListener('change', () => { if (preference.matches) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
