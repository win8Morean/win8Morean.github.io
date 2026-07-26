/* ═══════════════════════════════════════════════════════════════
   Navbar Scroll-Hide
   ═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   Fireflies
   ═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   Click Ripple Canvas
   ═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   Visitor Badge — show when busuanzi loads
   ═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   Digital Clock — Footer
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const clockEl = document.getElementById('bentoClock');
  const runtimeEl = document.getElementById('bentoRuntime');
  const uptimeEl = document.getElementById('homeUptime');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = h + ':' + m + ':' + s;
    const uptimeText = getSiteUptimeText();
    if (runtimeEl) runtimeEl.textContent = 'UP ' + uptimeText;
    if (uptimeEl) uptimeEl.textContent = uptimeText;
  }
  tick();
  setInterval(tick, 1000);
})();


/* ═══════════════════════════════════════════════════════════════
   QR Code Modal
   ═══════════════════════════════════════════════════════════════ */
function showQRCode(type) {
  const overlay = document.getElementById('qrOverlay');
  const img = document.getElementById('qrImage');
  const label = document.getElementById('qrLabel');
  if (!overlay || !img || !label) return;
  if (type === 'qq') {
    img.src = 'images/qq_qr.jpg';
    label.textContent = 'QQ · 扫一扫添加好友';
  } else if (type === 'wechat') {
    img.src = 'images/wechat_qr.jpg';
    label.textContent = '微信 · 扫一扫添加好友';
  }
  overlay.classList.add('visible');
}

(() => {
  const overlay = document.getElementById('qrOverlay');
  const closeBtn = document.getElementById('qrClose');
  if (!overlay) return;

  function closeQR() {
    overlay.classList.remove('visible');
  }

  closeBtn.addEventListener('click', closeQR);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQR();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) closeQR();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   Music Sync — APlayer → Bento Card
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const coverEl  = document.getElementById('syncCover');
  const titleEl  = document.getElementById('syncTitle');
  const authorEl = document.getElementById('syncAuthor');
  const lyricEl  = document.getElementById('syncLyricText');
  if (!coverEl || !titleEl || !authorEl) return;

  let lastLyric = '';
  const poll = setInterval(() => {
    const meting = document.querySelector('meting-js');
    if (!meting || !meting.aplayer) return;

    const ap = meting.aplayer;
    clearInterval(poll);

    function updateSongInfo() {
      const idx = ap.list.index;
      const song = ap.list.audios[idx];
      if (!song) return;
      titleEl.textContent = song.name || song.title || 'Unknown';
      authorEl.textContent = song.artist || song.author || 'Unknown';
      if (song.cover) {
        coverEl.src = song.cover;
        coverEl.style.opacity = '1';
      }
    }

    /* ── Lyric sync on timeupdate ── */
    ap.on('timeupdate', () => {
      const cur = document.querySelector('.aplayer-lrc-current');
      if (cur) {
        let txt = cur.textContent || cur.innerText;
        txt = txt.trim();
        if (txt && txt !== 'Loading' && txt !== lastLyric) {
          lastLyric = txt;
          if (lyricEl) {
            lyricEl.style.opacity = '0';
            setTimeout(() => {
              lyricEl.textContent = txt;
              lyricEl.style.opacity = '1';
            }, 300);
          }
        }
      }
    });

    /* ── Reset lyric on song switch / pause ── */
    ap.on('listswitch', () => {
      updateSongInfo();
      lastLyric = '';
      if (lyricEl) {
        lyricEl.style.opacity = '0';
        setTimeout(() => {
          lyricEl.textContent = '即将播放...';
          lyricEl.style.opacity = '1';
        }, 300);
      }
    });
    ap.on('play', () => {
      updateSongInfo();
      if (lyricEl) {
        lyricEl.style.opacity = '0';
        setTimeout(() => {
          lyricEl.textContent = '♪ 享受音乐中...';
          lyricEl.style.opacity = '1';
        }, 300);
      }
    });
    ap.on('pause', () => {
      if (lyricEl) {
        lyricEl.style.opacity = '0';
        setTimeout(() => {
          lyricEl.textContent = '音乐已暂停';
          lyricEl.style.opacity = '1';
        }, 300);
      }
    });

    /* Initial sync */
    updateSongInfo();
  }, 300);

  /* Safety: stop polling after 15s if APlayer never loads */
  setTimeout(() => clearInterval(poll), 15000);
})();

/* ═══════════════════════════════════════════
   Danmaku Launch System
   ═══════════════════════════════════════════ */
(function() {
  const container = document.getElementById('danmaku-container');
  if (!container) return;

  const quotes = [
    'Talk is cheap, show me the code.',
    'Pwn the world.',
    'system("/bin/sh")',
    'GROMACS running...',
    'Ciallo～(∠・ω< )⌒★',
    'Warning: Stack Smashing Detected',
    'Segmentation fault (core dumped)',
    'rm -rf / --no-preserve-root',
    'id > /tmp/pwned',
    'nc -e /bin/sh 10.0.0.1 4444',
    'ROP chain is coming...',
    'NOP sled incoming ——',
    "I'm in.",
    'echo 0 > /proc/sys/kernel/randomize_va_space',
    'BUFSIZ is never enough.',
    'El Psy Kongroo.',
    '私、気になります！',
    'ここは私の領域です。',
    'heap spray in 3... 2... 1...',
    'Connection reset by peer.',
    '0xdeadbeef',
    '41414141',
    'turtle all the way down.',
    'exploit/multi/handler ready.',
    'shellcode injected.',
    '<script>alert(1)</script>',
    'DROP TABLE users;--',
    "It's not a bug, it's a feature.",
    'Hello, World.',
    'while true; do echo pwn; done',
    'The quieter you become, the more you can hear.',
  ];

  function shootDanmaku() {
    const text = quotes[Math.floor(Math.random() * quotes.length)];
    const span = document.createElement('span');
    span.className = 'danmaku-item';
    span.textContent = text;

    const top = 10 + Math.random() * 80; // 10% ~ 90%
    const duration = 10 + Math.random() * 10; // 10s ~ 20s

    span.style.top = top + '%';
    span.style.animation = 'danmakuFloat ' + duration + 's linear forwards';

    container.appendChild(span);

    /* Clean up after animation ends to prevent memory leak */
    setTimeout(function() {
      if (span.parentNode) span.parentNode.removeChild(span);
    }, duration * 1000 + 200);
  }

  /* Fire one immediately, then every 2~3 seconds */
  shootDanmaku();
  setInterval(shootDanmaku, 2500);
})();

/* ═══════════════════════════════════════════
   Global Background Slideshow
   ═══════════════════════════════════════════ */
(function() {
  var slider = document.getElementById('global-bg-slider');
  if (!slider) return;

  var bgImages = [
    'images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg',
    'images/bg4.jpg', 'images/bg5.jpg', 'images/bg6.jpg'
  ];
  var idx = 0;

  /* Init first slide */
  slider.style.backgroundImage = 'url(' + bgImages[0] + ')';

  /* Rotate every 10s with crossfade (CSS transition handles the fade) */
  setInterval(function() {
    idx = (idx + 1) % bgImages.length;
    slider.style.backgroundImage = 'url(' + bgImages[idx] + ')';
  }, 10000);
})();

/* ═══════════════════════════════════════════
   Mobile Radial Menu
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   Yanami Assistant Widget
   ═══════════════════════════════════════════ */
(function() {
  var widget = document.getElementById('assistantWidget');
  var avatarBtn = document.getElementById('assistantAvatarBtn');
  var avatar = document.getElementById('assistantAvatar');
  var bubble = document.getElementById('assistantBubble');
  if (!widget || !avatarBtn || !avatar || !bubble) return;

  var states = {
    idle: {
      src: 'images/yanami-assistant/idle.png',
      lines: ['你来啦，我还以为你今天不点我呢。', '先说好，我只是刚好也在这里而已。', '想去哪一页？我、我可以陪你看看。']
    },
    thanks: {
      src: 'images/yanami-assistant/thanks.png',
      lines: ['欸，突然这么认真地谢我，我会不好意思的。', '这样就对了嘛，至少你还记得我。', '哼，也不算白陪你待在这里。']
    },
    morning: {
      src: 'images/yanami-assistant/morning.png',
      lines: ['早安。今天别一上来就发呆哦。', '新的一天开始了，你应该会比昨天更有干劲吧？']
    },
    night: {
      src: 'images/yanami-assistant/night.png',
      lines: ['晚安。再熬下去的话，我可不会陪你一起困。', '差不多就去睡吧，明天再继续也来得及。']
    },
    sleepy: {
      src: 'images/yanami-assistant/sleepy.png',
      lines: ['你也太安静了吧，我都快睡着了。', '要是暂时没事，我先打个盹……就一小会儿。']
    },
    confused: {
      src: 'images/yanami-assistant/confused.png',
      lines: ['诶？你这一步是不是跳太快了。', '等等，我没跟上……你再点一次给我看看。']
    },
    great: {
      src: 'images/yanami-assistant/great.png',
      lines: ['这个不错诶，比我想的还顺利。', '好棒……咳，我是说，做得还挺像样。']
    },
    numb: {
      src: 'images/yanami-assistant/numb.png',
      lines: ['嗯……我先放空一下，你别催。', '脑子有点转不动了，让我呆一会儿。']
    },
    cheer: {
      src: 'images/yanami-assistant/cheer.png',
      lines: ['加油啦，我可是在认真给你打气。', '继续冲，我都举手了，你可别掉链子。']
    }
  };

  var cycle = ['idle', 'thanks', 'great', 'confused', 'numb', 'sleepy', 'cheer'];
  var index = 0;
  var bubbleTimer = null;
  var idleTimer = null;

  function rand(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function hideBubbleSoon(ms) {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function() {
      bubble.classList.add('is-hidden');
    }, ms);
  }

  function speak(text, duration) {
    bubble.textContent = text;
    bubble.classList.remove('is-hidden');
    hideBubbleSoon(duration || 3400);
  }

  function setState(name, speakNow) {
    var state = states[name] || states.idle;
    avatar.src = state.src;
    avatar.dataset.state = name;
    if (speakNow) speak(rand(state.lines));
  }

  function setTimeAwareDefault() {
    var hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setState('morning', true);
    else if (hour >= 22 || hour < 4) setState('night', true);
    else setState('idle', true);
  }

  function bumpCycle() {
    index = (index + 1) % cycle.length;
    setState(cycle[index], true);
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function() {
      setState('sleepy', true);
    }, 45000);
  }

  avatarBtn.addEventListener('click', function(e) {
    e.preventDefault();
    bumpCycle();
    resetIdleTimer();
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) return;
    resetIdleTimer();
  });

  document.addEventListener('click', function(e) {
    if (widget.contains(e.target)) return;
    resetIdleTimer();
  }, { passive: true });

  setTimeAwareDefault();
  resetIdleTimer();

  setInterval(function() {
    var current = avatar.dataset.state || 'idle';
    if (current === 'sleepy') return;
    if (Math.random() < 0.35) {
      var passiveStates = ['idle', 'numb', 'great', 'confused'];
      setState(passiveStates[Math.floor(Math.random() * passiveStates.length)], true);
    }
  }, 32000);
})();

/* ═══════════════════════════════════════════
   Top Nav Search
   ═══════════════════════════════════════════ */
(function() {
  var input = document.getElementById('navSearchInput');
  var dropdown = document.getElementById('navSearchDropdown');
  var mobileFab = document.getElementById('mobileFab');
  if (!input || !dropdown) return;

  var searchIndex = navSearchPages.map(function(item) {
    return {
      type: item.type,
      title: item.title,
      meta: item.meta,
      action: item.action,
      keywords: item.keywords.join(' ')
    };
  });
  var activeResultIndex = -1;
  var clearDropdownTimer = null;
  buildSearchIndex().then(function(entries) {
    searchIndex = entries;
  });

  function normalize(text) {
    return (text || '').toLowerCase().trim();
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightText(text, query) {
    var safeText = escapeHtml(text || '');
    if (!query) return safeText;
    var safeQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + safeQuery + ')', 'ig');
    return safeText.replace(regex, '<mark class="nav-search-highlight">$1</mark>');
  }

  function closeDropdown() {
    if (clearDropdownTimer) clearTimeout(clearDropdownTimer);
    dropdown.classList.remove('visible');
    activeResultIndex = -1;
    clearDropdownTimer = setTimeout(function() {
      dropdown.innerHTML = '';
    }, 180);
  }

  function openResult(entry) {
    if (!entry) return;
    closeDropdown();
    input.value = '';

    if (typeof entry.open === 'function') {
      entry.open();
      return;
    }

    if (entry.action) {
      var btn = document.querySelector('[data-action="' + entry.action + '"]');
      if (btn) btn.click();
    }
  }

  function renderResults(results) {
    if (clearDropdownTimer) clearTimeout(clearDropdownTimer);
    dropdown.innerHTML = '';
    activeResultIndex = -1;
    if (!results.length) {
      dropdown.innerHTML =
        '<div class="nav-search-empty">' +
          '<span class="nav-search-empty-title">没有找到匹配内容。</span>' +
          '<span class="nav-search-empty-meta">可以换个关键词试试，或者直接从导航和专题入口进入。</span>' +
        '</div>';
      dropdown.classList.add('visible');
      return;
    }

    results.slice(0, 6).forEach(function(entry) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-search-result';
      button.dataset.resultIndex = String(dropdown.children.length);
      var badge = entry.type === 'page'
        ? 'PAGE'
        : (entry.type === 'post'
          ? 'POST'
          : (entry.type === 'chatter' ? 'NOTE' : 'MOMENT'));
      button.innerHTML =
        '<span class="nav-search-result-top">' +
          '<span class="nav-search-result-badge">' + badge + '</span>' +
          '<span class="nav-search-result-meta">' + entry.meta + '</span>' +
        '</span>' +
        '<span class="nav-search-result-title">' + highlightText(entry.title, input.value.trim()) + '</span>' +
        '<span class="nav-search-result-desc">' + highlightText(entry.desc || '', input.value.trim()) + '</span>';
      button.addEventListener('click', function() {
        openResult(entry);
      });
      dropdown.appendChild(button);
    });
    dropdown.classList.add('visible');
  }

  function getResultButtons() {
    return Array.prototype.slice.call(dropdown.querySelectorAll('.nav-search-result'));
  }

  function syncActiveResult() {
    var buttons = getResultButtons();
    buttons.forEach(function(btn, idx) {
      btn.classList.toggle('is-active', idx === activeResultIndex);
    });
  }

  input.addEventListener('input', function() {
    var q = normalize(input.value);
    if (!q) {
      closeDropdown();
      return;
    }
    var results = searchIndex.filter(function(entry) {
      return normalize(entry.title).includes(q) || normalize(entry.keywords).includes(q);
    });
    renderResults(results);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeDropdown();
      input.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      var buttons = getResultButtons();
      if (!buttons.length) return;
      activeResultIndex = (activeResultIndex + 1 + buttons.length) % buttons.length;
      syncActiveResult();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      var buttonsUp = getResultButtons();
      if (!buttonsUp.length) return;
      activeResultIndex = (activeResultIndex - 1 + buttonsUp.length) % buttonsUp.length;
      syncActiveResult();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      var buttonsEnter = getResultButtons();
      if (!buttonsEnter.length) return;
      if (activeResultIndex < 0) activeResultIndex = 0;
      var target = buttonsEnter[activeResultIndex];
      if (target) target.click();
    }
  });

  input.addEventListener('focus', function() {
    if (window.innerWidth <= 768 && mobileFab) {
      mobileFab.classList.add('is-hidden');
    }
  });

  document.addEventListener('keydown', function(e) {
    var isShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if (!isShortcut) return;
    e.preventDefault();
    input.focus();
    input.select();
  });

  input.addEventListener('blur', function() {
    setTimeout(function() {
      if (window.innerWidth <= 768 && mobileFab) {
        mobileFab.classList.remove('is-hidden');
      }
    }, 120);
  });

  document.addEventListener('click', function(e) {
    if (e.target === input || dropdown.contains(e.target)) return;
    closeDropdown();
  });
})();
