(function() {
  var clockEl = document.getElementById('bentoClock');
  var runtimeEl = document.getElementById('bentoRuntime');
  var uptimeEl = document.getElementById('homeUptime');
  var siteStartDate = (window.BLOG_DATA && window.BLOG_DATA.siteStartDate) || '2026-05-12T00:00:00';
  if (!clockEl) return;

  function getSiteUptimeText() {
    var start = new Date(siteStartDate);
    if (isNaN(start.getTime())) return '0 days';

    var diff = Date.now() - start.getTime();
    if (diff < 0) diff = 0;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return days + ' days ' + hours + ' hours';
  }

  function tick() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');

    clockEl.textContent = h + ':' + m + ':' + s;

    var uptimeText = getSiteUptimeText();
    if (runtimeEl) runtimeEl.textContent = 'UP ' + uptimeText;
    if (uptimeEl) uptimeEl.textContent = uptimeText;
  }

  tick();
  setInterval(tick, 1000);
})();
