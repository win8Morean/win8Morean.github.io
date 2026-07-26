(() => {
  const canvas = document.getElementById('rippleCanvas');
  const ctx = canvas.getContext('2d');
  const ripples = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('click', (e) => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 4, opacity: 0.7, velocity: 2.5, maxR: 50 + Math.random() * 35 });
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(99,102,241,0.5)';

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.velocity;
      r.velocity *= 0.96;
      r.opacity -= 0.016;
      if (r.opacity <= 0 || r.radius > r.maxR) { ripples.splice(i, 1); continue; }

      const progress = r.radius / r.maxR;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99,102,241,' + (r.opacity * 0.7) + ')';
      ctx.lineWidth = 2.5 * (1 - progress);
      ctx.stroke();
      ctx.fillStyle = 'rgba(129,140,248,' + (r.opacity * 0.15) + ')';
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  animate();
})();

