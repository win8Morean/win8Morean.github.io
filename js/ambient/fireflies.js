(() => {
  const container = document.getElementById('fireflies');
  const COUNT = 32;
  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'firefly';
    dot.style.left = (Math.random() * 100) + '%';
    dot.style.top = (Math.random() * 100) + '%';
    const size = 3 + Math.random() * 5;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.setProperty('--ff-duration', (9 + Math.random() * 18) + 's');
    dot.style.setProperty('--ff-delay', (Math.random() * -22) + 's');
    dot.style.setProperty('--ff-dx1', ((Math.random() - 0.5) * 140) + 'px');
    dot.style.setProperty('--ff-dy1', ((Math.random() - 0.5) * 140) + 'px');
    dot.style.setProperty('--ff-dx2', ((Math.random() - 0.5) * 180) + 'px');
    dot.style.setProperty('--ff-dy2', ((Math.random() - 0.5) * 180) + 'px');
    container.appendChild(dot);
  }
})();

