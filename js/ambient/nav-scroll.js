(() => {
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    if (scrollY > lastScrollY && scrollY > 80) {
      navbar.classList.add('hidden');
    } else if (scrollY < lastScrollY) {
      navbar.classList.remove('hidden');
    }
    if (scrollY <= 20) navbar.classList.remove('hidden');
    lastScrollY = scrollY;
    ticking = false;
  }

  /* Track scroll on content view */
  const contentView = document.getElementById('contentView');
  if (contentView) {
    contentView.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

