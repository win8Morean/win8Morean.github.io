(() => {
  const badge = document.getElementById('visitorBadge');
  const check = setInterval(() => {
    const num = document.getElementById('busuanzi_value_site_pv');
    if (num && num.textContent && num.textContent !== '--' && badge) {
      badge.classList.add('visible');
      clearInterval(check);
    }
  }, 500);
  /* fallback: show after 5s anyway */
  setTimeout(() => { if (badge) badge.classList.add('visible'); }, 5000);
})();

