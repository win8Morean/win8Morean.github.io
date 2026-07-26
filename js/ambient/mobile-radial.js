(function() {
  var fab        = document.getElementById('mobileFab');
  var backdrop   = document.getElementById('radialBackdrop');
  var menu       = document.getElementById('radialMenu');
  var closeBtn   = document.getElementById('radialClose');
  var ring       = document.getElementById('radialRing');
  var items      = document.querySelectorAll('.radial-item');
  if (!fab || !backdrop || !menu || !closeBtn || !items.length) return;

  var isOpen     = false;
  var radius     = 150; /* px from center to item center */
  var itemCount  = items.length;

  /* Position items in a circle */
  function positionItems() {
    var angleStep = 360 / itemCount;
    items.forEach(function(item, i) {
      var angle = (i * angleStep - 90) * (Math.PI / 180); /* start from top */
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      item.style.left = x + 'px';
      item.style.top  = y + 'px';
      item.style.transitionDelay = (i * 0.03) + 's';
    });
  }
  positionItems();

  function openMenu() {
    isOpen = true;
    backdrop.classList.add('open');
    menu.classList.add('open');
    fab.classList.add('is-hidden');
  }

  function closeMenu() {
    isOpen = false;
    backdrop.classList.remove('open');
    menu.classList.remove('open');
    fab.classList.remove('is-hidden');
  }

  fab.addEventListener('click', function(e) {
    e.preventDefault();
    if (isOpen) closeMenu();
    else openMenu();
  });

  backdrop.addEventListener('click', closeMenu);
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
  });

  /* Item clicks: navigate via existing button bindings, then close */
  items.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      var action = item.dataset.action;
      /* Trigger the existing data-action button */
      var btn = document.querySelector('.bento-chip[data-action="' + action + '"]');
      if (btn) btn.click();
      else {
        var navLink = document.querySelector('.nav-link[data-action="' + action + '"]');
        if (navLink) navLink.click();
      }
      closeMenu();
    });
  });

  /* Initial active state */
  var activeItem = document.querySelector('.radial-item[data-action="home"]');
  if (activeItem) activeItem.classList.add('active');
})();

