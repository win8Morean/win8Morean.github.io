function showQRCode(type) {
  var overlay = document.getElementById('qrOverlay');
  var img = document.getElementById('qrImage');
  var label = document.getElementById('qrLabel');
  if (!overlay || !img || !label) return;

  if (type === 'qq') {
    img.src = 'images/qq_qr.jpg';
    label.textContent = 'QQ - scan to add';
  } else if (type === 'wechat') {
    img.src = 'images/wechat_qr.jpg';
    label.textContent = 'WeChat - scan to add';
  }

  overlay.classList.add('visible');
}

window.showQRCode = showQRCode;

(function() {
  var overlay = document.getElementById('qrOverlay');
  var closeBtn = document.getElementById('qrClose');
  if (!overlay || !closeBtn) return;

  function closeQR() {
    overlay.classList.remove('visible');
  }

  closeBtn.addEventListener('click', closeQR);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeQR();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) closeQR();
  });
})();
