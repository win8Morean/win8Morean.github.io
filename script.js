/* ═══════════════════════════════════════════════════════════════
   Typewriter Effect
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const el = document.getElementById('typewriter');
  const nav = document.getElementById('nav');

  const fullText = 'w1n8';

  let i = 0;
  const TYPE_SPEED = 60;
  const LINE_PAUSE = 320;

  function type() {
    if (i < fullText.length) {
      el.textContent += fullText[i];
      i++;
      setTimeout(type, fullText[i - 1] === '\n' ? LINE_PAUSE : TYPE_SPEED);
    } else {
      nav.classList.add('visible');
    }
  }

  setTimeout(type, 500);
})();

/* ═══════════════════════════════════════════════════════════════
   Theme System — light/dark toggle + localStorage + Giscus sync
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    syncGiscusTheme(theme);
  }

  function syncGiscusTheme(theme) {
    var giscusTheme = theme === 'dark' ? 'dark' : 'light';
    function send() {
      var iframes = document.querySelectorAll('iframe');
      iframes.forEach(function(iframe) {
        if (!iframe.src || iframe.src.indexOf('giscus.app') === -1) return;
        try {
          iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: giscusTheme } } },
            'https://giscus.app'
          );
        } catch(e) {}
      });
    }
    send();
    setTimeout(send, 400);
    setTimeout(send, 1200);
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || getSystemPreference();
    applyTheme(theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (getStoredTheme()) return;
    applyTheme(e.matches ? 'dark' : 'light');
  });

  initTheme();
})();

/* ═══════════════════════════════════════════════════════════════
   Post List Data (for Writeups)
   ═══════════════════════════════════════════════════════════════ */
const postList = [
  { title: '第一周学习记录', date: '2025-11-09', filename: 'week_1(November).md' }
];

/* ═══════════════════════════════════════════════════════════════
   Chatter Moments — file list for chatters/ directory
   Add new .md filename here when you create a new 说说 post.
   ═══════════════════════════════════════════════════════════════ */
const chatterMomentsList = [
  '2026-05-12.md'
];

/* ═══════════════════════════════════════════════════════════════
   SPA Router — 9 Sections
   ═══════════════════════════════════════════════════════════════ */
(() => {
  /* DOM refs */
  const homeView      = document.getElementById('homeView');
  const contentView   = document.getElementById('contentView');
  const contentInner  = document.getElementById('contentInner');
  const articleOverlay = document.getElementById('articleOverlay');
  const articleBody   = document.getElementById('articleBody');
  const articlePath   = document.getElementById('articlePath');
  const articleBack   = document.getElementById('articleBack');

  let currentView = 'home';
  let currentWriteupIndex = null;

  /* ── marked.js config ── */
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: false,
    gfm: true
  });

  /* ── Giscus loader (deduped, cleans up before inserting) ── */
  var _aboutGiscusTimer = null;

  function loadGiscus(container, theme) {
    if (!container) return;
    // Remove any existing Giscus scripts / iframes first
    container.querySelectorAll('script[src*="giscus.app"]').forEach(function(s) { s.remove(); });
    container.querySelectorAll('iframe').forEach(function(f) {
      if (f.src && f.src.indexOf('giscus.app') !== -1) f.remove();
    });
    var script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'win8Morean/win8Morean.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOQNWlaQ');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOQNWlac4C8s6j');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    container.appendChild(script);
  }

  /* ── View Transitions ── */
  function showHome() {
    homeView.classList.remove('hidden');
    contentView.classList.remove('visible');
    articleOverlay.classList.remove('visible');
    currentView = 'home';
    updateActiveNav('home');
    document.title = 'w1n8 | Web Security';
  }

  function showPage() {
    homeView.classList.add('hidden');
    articleOverlay.classList.remove('visible');
    contentView.classList.add('visible');
    contentView.scrollTop = 0;
    document.body.classList.remove('route-about');
    // Cancel any pending About Giscus timer
    if (_aboutGiscusTimer) { clearTimeout(_aboutGiscusTimer); _aboutGiscusTimer = null; }
  }

  function showArticle() {
    articleOverlay.classList.add('visible');
  }

  function hideArticle() {
    articleOverlay.classList.remove('visible');
    // Clean up Giscus iframe in article body to stop polling
    var ab = document.getElementById('articleBody');
    if (ab) {
      ab.querySelectorAll('script[src*="giscus.app"]').forEach(function(s) { s.remove(); });
      ab.querySelectorAll('iframe').forEach(function(f) {
        if (f.src && f.src.indexOf('giscus.app') !== -1) f.remove();
      });
    }
  }

  /* ── Active Nav State ── */
  function updateActiveNav(action) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.bento-chip').forEach(b => b.classList.remove('active'));
    var navLink = document.querySelector('.nav-link[data-action="' + action + '"]');
    if (navLink) navLink.classList.add('active');
    var chipBtn = document.querySelector('.bento-chip[data-action="' + action + '"]');
    if (chipBtn) chipBtn.classList.add('active');
    /* Also update radial menu active state */
    document.querySelectorAll('.radial-item').forEach(function(r) { r.classList.remove('active'); });
    var radialItem = document.querySelector('.radial-item[data-action="' + action + '"]');
    if (radialItem) radialItem.classList.add('active');
  }

  /* ── Section Header Helper ── */
  function sectionHTML(title, subtitle) {
    return '' +
      '<div class="section-header">' +
        '<h2 class="section-title">' + title + '</h2>' +
        (subtitle ? '<p class="section-subtitle">' + subtitle + '</p>' : '') +
        '<div class="section-divider"></div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     1. Home
     ═══════════════════════════════════════════ */
  function renderHome() { showHome(); }

  /* ═══════════════════════════════════════════
     2. Projects (Lab)
     ═══════════════════════════════════════════ */
  function renderProjects() {
    showPage();
    currentView = 'projects';
    updateActiveNav('projects');
    document.title = '项目 | w1n8';

    const projects = [
      {
        name: 'w1n8 Blog',
        icon: '🏠',
        desc: '一个用于记录学习笔记、CTF 练习、Web 安全入门、生活照片和个人项目的个人博客。整体采用玻璃拟态、二次元背景、暗色/日间主题切换和响应式布局设计。',
        tags: ['HTML5', 'CSS3', 'Vanilla JS', 'GitHub Pages', 'Cloudflare', 'APlayer', 'Giscus'],
        liveUrl: 'https://win8Morean.github.io',
        repoUrl: 'https://github.com/win8Morean/win8Morean.github.io'
      }
    ];

    contentInner.innerHTML =
      sectionHTML('PROJECTS MATRIX', '项目矩阵') +
      '<div class="projects-grid">' +
        projects.map(function(p) {
          return '' +
            '<div class="project-card">' +
              '<div class="project-icon">' + p.icon + '</div>' +
              '<div class="project-name">' + p.name + '</div>' +
              '<div class="project-desc">' + p.desc + '</div>' +
              '<div class="project-tags">' +
                p.tags.map(function(t) {
                  return '<span class="project-tag">' + t + '</span>';
                }).join('') +
              '</div>' +
              '<div class="project-links">' +
                '<a class="project-btn project-btn--primary" href="' + p.liveUrl + '" target="_blank" rel="noopener">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
                  '在线预览' +
                '</a>' +
                '<a class="project-btn" href="' + p.repoUrl + '" target="_blank" rel="noopener">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>' +
                  'GitHub' +
                '</a>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     3. Writeups (Archives) — uses .md loading + Giscus
     ═══════════════════════════════════════════ */
  function renderArchive() {
    showPage();
    currentView = 'writeups';
    updateActiveNav('writeups');
    document.title = '归档 | w1n8';

    const categories = ['全部', 'CTF Writeups', '渗透测试', '漏洞复现'];

    contentInner.innerHTML =
      sectionHTML('归档', 'ARCHIVE — 技术沉淀') +
      '<div class="archive-filters">' +
        categories.map((cat, i) =>
          '<button class="archive-pill' + (i === 0 ? ' active' : '') + '">' + cat + '</button>'
        ).join('') +
      '</div>' +
      '<div class="archive-empty">暂无归档内容</div>';

    contentInner.querySelectorAll('.archive-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        contentInner.querySelectorAll('.archive-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  /* ── Article Reader (shared by Writeups & Chatter) ── */
  async function openArticle(index, source) {
    const post = postList[index];
    const basePath = 'posts/';

    articlePath.textContent = '~/' + source + '/' + post.filename;
    articleBody.innerHTML = '<div class="article-loading">Loading ' + post.filename + ' ...</div>';
    currentWriteupIndex = index;
    showArticle();

    try {
      const res = await fetch(basePath + post.filename);
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const md = await res.text();
      const html = marked.parse(md);

      const articleDiv = document.createElement('div');
      articleDiv.className = 'article-content';
      articleDiv.innerHTML = html;

      /* Giscus comment system */
      const giscusWrap = document.createElement('div');
      giscusWrap.className = 'giscus-container';

      const giscusDiv = document.createElement('div');
      giscusDiv.className = 'giscus';
      giscusWrap.appendChild(giscusDiv);

      articleDiv.appendChild(giscusWrap);
      loadGiscus(giscusDiv, document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
      articleBody.innerHTML = '';
      articleBody.appendChild(articleDiv);
      articleBody.scrollTop = 0;
    } catch (err) {
      articleBody.innerHTML = '' +
        '<div class="post-list-empty">' +
          '加载失败: ' + post.filename + '<br>' +
          '<span style="font-size:12px;color:var(--slate-500)">' + err.message + '</span>' +
        '</div>';
    }
  }

  /* ── Article Back Button ── */
  articleBack.addEventListener('click', (e) => {
    e.preventDefault();
    hideArticle();
  });

  /* ═══════════════════════════════════════════
     4. Photos (Photo Wall)
     ═══════════════════════════════════════════ */
  function renderPhotos() {
    showPage();
    currentView = 'photos';
    updateActiveNav('photos');
    document.title = '照片墙 | w1n8';

    contentInner.innerHTML =
      sectionHTML('光影画廊', 'PHOTOS — 一些值得记录的瞬间') +
      '<div class="photo-album-card" onclick="renderPhotoAlbum()">' +
        '<div class="photo-stack-wrap">' +
          '<img src="images/tomori.jpg" alt="败犬">' +
          '<img src="images/Yanami_4.JPG" alt="败犬">' +
        '</div>' +
        '<div class="photo-album-name">败犬</div>' +
        '<div class="photo-album-count">点击查看相册</div>' +
      '</div>' +
      '<p style="text-align:center;margin-top:24px;color:var(--slate-500);font-size:13px;font-family:var(--font-serif)">' +
        '更多照片即将更新...' +
      '</p>';
  }

  /* ── Album detail: show all photos ── */
  function renderPhotoAlbum() {
    showPage();
    currentView = 'photos';
    updateActiveNav('photos');
    document.title = '败犬 | w1n8';

    const photos = [
      { src: 'images/Yanami_1.JPG',  label: '' },
      { src: 'images/Yanami_2.PNG',  label: '' },
      { src: 'images/Yanami_3.PNG',  label: '' },
      { src: 'images/Yanami_4.JPG',  label: '' },
      { src: 'images/Yanami_5.JPG',  label: '' },
      { src: 'images/Yanami_6.JPG',  label: '' },
      { src: 'images/Yanami_7.JPG',  label: '' },
      { src: 'images/Yanami_8.JPG',  label: '' },
      { src: 'images/Yanami.webp',   label: '' },
      { src: 'images/bg1.jpg',       label: '' },
      { src: 'images/bg2.jpg',       label: '' },
      { src: 'images/bg3.jpg',       label: '' },
      { src: 'images/bg4.jpg',       label: '' },
      { src: 'images/bg5.jpg',       label: '' },
      { src: 'images/bg6.jpg',       label: '' },
    ];

    contentInner.innerHTML =
      '<div class="album-detail-header">' +
        '<button class="album-back-btn" id="albumBackBtn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          '<span>返回相册</span>' +
        '</button>' +
        '<div class="album-detail-info">' +
          '<span class="album-detail-name">败犬</span>' +
          '<span class="album-detail-count">共 ' + photos.length + ' 张</span>' +
        '</div>' +
      '</div>' +
      '<div class="photos-grid">' +
        photos.map(p => '' +
          '<div class="photo-item">' +
            '<img src="' + p.src + '" alt="" loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
          '</div>'
        ).join('') +
      '</div>';

    document.getElementById('albumBackBtn').addEventListener('click', (e) => {
      e.preventDefault();
      renderPhotos();
    });
  }

  window.renderPhotoAlbum = renderPhotoAlbum;

  /* ═══════════════════════════════════════════
     5. Music — embedded BGM player page
     ═══════════════════════════════════════════ */
  function renderMusic() {
    showPage();
    currentView = 'music';
    updateActiveNav('music');
    document.title = '音乐 | w1n8';

    contentInner.innerHTML =
      sectionHTML('音乐馆', 'MUSIC — 沉浸式听歌体验') +
      /* Loading skeleton */
      '<div class="music-loading" id="musicLoading">' +
        '<div class="music-loading-spin"></div>' +
        '<p>正在连接播放器...</p>' +
      '</div>' +
      /* Dashboard (hidden until APlayer ready) */
      '<div class="music-dashboard" id="musicDashboard" style="display:none;">' +
        '<div class="music-visual">' +
          '<div class="music-ambient-glow" id="musicAmbientGlow"></div>' +
          '<div class="music-vinyl-large" id="musicVinylLarge">' +
            '<img src="" alt="Cover" class="music-cover-large" id="musicCoverLarge">' +
            '<div class="music-vinyl-hole-lg"></div>' +
          '</div>' +
        '</div>' +
        '<div class="music-panel">' +
          '<div class="music-now-title" id="musicNowTitle">--</div>' +
          '<div class="music-now-artist" id="musicNowArtist">--</div>' +
          '<div class="music-eq-viz" id="musicEqViz">' +
            Array.from({length:20}, () => '<span></span>').join('') +
          '</div>' +
          '<div class="music-ctrl-row">' +
            '<button class="music-ctrl-btn-lg" id="musicPrevBtn" title="上一首">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>' +
            '</button>' +
            '<button class="music-ctrl-btn-lg is-play" id="musicPlayPauseBtn" title="播放 / 暂停">' +
              '<svg class="icon-play" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
              '<svg class="icon-pause" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>' +
            '</button>' +
            '<button class="music-ctrl-btn-lg" id="musicNextBtn" title="下一首">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="music-playlist" id="musicPlaylist"></div>' +
        '</div>' +
      '</div>';

    /* ── Bind to APlayer ── */
    bindMusicDashboard();
  }

  function bindMusicDashboard() {
    const loadingEl   = document.getElementById('musicLoading');
    const dashboardEl = document.getElementById('musicDashboard');
    if (!loadingEl || !dashboardEl) return;

    /* Poll until APlayer is ready, then build the dashboard */
    const poll = setInterval(() => {
      const meting = document.querySelector('meting-js');
      if (!meting || !meting.aplayer || !meting.aplayer.list) return;
      const ap = meting.aplayer;
      clearInterval(poll);

      /* Show dashboard, hide loading */
      loadingEl.style.display = 'none';
      dashboardEl.style.display = '';

      /* DOM refs */
      const coverEl     = document.getElementById('musicCoverLarge');
      const glowEl      = document.getElementById('musicAmbientGlow');
      const vinylEl     = document.getElementById('musicVinylLarge');
      const titleEl     = document.getElementById('musicNowTitle');
      const artistEl    = document.getElementById('musicNowArtist');
      const playlistEl  = document.getElementById('musicPlaylist');
      const playPauseBtn = document.getElementById('musicPlayPauseBtn');
      const prevBtn     = document.getElementById('musicPrevBtn');
      const nextBtn     = document.getElementById('musicNextBtn');

      function fmtPlaying() { return ap.audio && !ap.audio.paused; }

      function getSongCover(song) {
        /* Try multiple sources for cover image */
        if (song) {
          if (song.cover) return song.cover;
          if (song.pic)   return song.pic;
          if (song.img)   return song.img;
        }
        /* Fallback: read from APlayer's own .aplayer-pic element */
        const picEl = document.querySelector('.aplayer-pic');
        if (picEl) {
          const bg = picEl.style.backgroundImage;
          if (bg && bg !== 'none') {
            const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
            if (match) return match[1];
          }
        }
        return '';
      }

      function applyCover(song) {
        var url = getSongCover(song);
        if (url) {
          coverEl.src = url;
          glowEl.style.backgroundImage = 'url(' + url + ')';
        }
      }

      function updateInfo(song) {
        if (!song) return;
        titleEl.textContent = song.name || song.title || 'Unknown';
        artistEl.textContent = song.artist || song.author || 'Unknown';
        applyCover(song);
      }

      function updateVinyl() {
        vinylEl.classList.toggle('spinning', fmtPlaying());
        playPauseBtn.classList.toggle('is-play', !fmtPlaying());
      }

      function buildPlaylist() {
        if (!ap.list || !ap.list.audios) return;
        playlistEl.innerHTML = ap.list.audios.map((s, i) =>
          '<div class="music-pl-item' + (i === ap.list.index ? ' active' : '') + '" data-idx="' + i + '">' +
            '<span class="music-pl-idx">' + String(i + 1).padStart(2,'0') + '</span>' +
            '<span class="music-pl-name">' + (s.name || s.title || 'Track '+(i+1)) + '</span>' +
            '<span class="music-pl-artist">' + (s.artist || s.author || '') + '</span>' +
          '</div>'
        ).join('');

        /* Click to switch */
        playlistEl.querySelectorAll('.music-pl-item').forEach(el => {
          el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.idx);
            if (idx === ap.list.index) return;
            ap.list.switch(idx);
          });
        });
      }

      function refreshPlaylistHighlight() {
        playlistEl.querySelectorAll('.music-pl-item').forEach((el, i) => {
          el.classList.toggle('active', i === ap.list.index);
        });
      }

      /* ── Controls ── */
      prevBtn.addEventListener('click', (e) => { e.preventDefault(); ap.skipBack(); });
      nextBtn.addEventListener('click', (e) => { e.preventDefault(); ap.skipForward(); });
      playPauseBtn.addEventListener('click', (e) => { e.preventDefault(); ap.toggle(); });

      /* ── Events ── */
      ap.on('play', updateVinyl);
      ap.on('pause', updateVinyl);
      ap.on('listswitch', () => {
        const song = ap.list.audios[ap.list.index];
        updateInfo(song);
        refreshPlaylistHighlight();
        updateVinyl();
        /* Delayed retry for cover (may load async) */
        setTimeout(() => applyCover(ap.list.audios[ap.list.index]), 600);
      });

      /* ── Init ── */
      const initSong = ap.list.audios[ap.list.index];
      updateInfo(initSong);
      updateVinyl();
      buildPlaylist();
      /* Retry cover after Netease API may have resolved */
      setTimeout(() => applyCover(ap.list.audios[ap.list.index]), 400);
      setTimeout(() => applyCover(ap.list.audios[ap.list.index]), 1200);
    }, 250);

    /* Safety timeout */
    setTimeout(() => {
      clearInterval(poll);
      if (loadingEl && loadingEl.style.display !== 'none') {
        loadingEl.innerHTML = '<p style="color:var(--slate-500)">播放器未就绪，请确认左下角音乐已加载。</p>';
      }
    }, 12000);
  }

  /* ═══════════════════════════════════════════
     6. Moments (说说)
     ═══════════════════════════════════════════ */
  function renderMoments() {
    showPage();
    currentView = 'moments';
    updateActiveNav('moments');
    document.title = '说说 | w1n8';

    contentInner.innerHTML =
      sectionHTML('说说', 'MOMENTS — 碎片化记录') +
      '<div class="moments-list" id="momentsList">' +
        '<div class="moments-loading">' +
          '<div class="moments-loading-spin"></div>' +
          '<p>加载说说中...</p>' +
        '</div>' +
      '</div>';

    loadMoments();
  }

  async function loadMoments() {
    const container = document.getElementById('momentsList');
    if (!container) return;

    const basePath = 'chatters/';
    const moments = [];

    for (var i = 0; i < chatterMomentsList.length; i++) {
      try {
        var res = await fetch(basePath + chatterMomentsList[i]);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        var md = await res.text();
        var fm = parseFrontmatter(md);
        moments.push({
          filename: chatterMomentsList[i],
          date: fm.date || '',
          time: fm.time || '',
          tags: fm.tags || [],
          content: fm.content || md
        });
      } catch (err) {
        console.warn('Failed to load moment: ' + chatterMomentsList[i], err);
      }
    }

    moments.sort(function(a, b) {
      var da = a.date + (a.time || '00:00');
      var db = b.date + (b.time || '00:00');
      if (da > db) return -1;
      if (da < db) return 1;
      return 0;
    });

    if (moments.length === 0) {
      container.innerHTML = '<div class="post-list-empty">还没有说说，敬请期待。</div>';
      return;
    }

    container.innerHTML = moments.map(function(m) {
      var dateDisplay = m.date;
      if (m.time) dateDisplay += ' ' + m.time;

      var tagsHTML = '';
      if (m.tags.length > 0) {
        tagsHTML = '<div class="moment-tags">' +
          m.tags.map(function(t) {
            return '<span class="moment-tag">#' + t + '</span>';
          }).join('') +
        '</div>';
      }

      var contentHTML = marked.parse(m.content.trim());

      return '' +
        '<div class="moment-card">' +
          '<div class="moment-header">' +
            '<div class="moment-avatar">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
            '</div>' +
            '<div class="moment-meta">' +
              '<span class="moment-author">w1n8</span>' +
              '<span class="moment-time">' + dateDisplay + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="moment-body">' + contentHTML + '</div>' +
          tagsHTML +
        '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     7. Chatter (杂谈) — .md loading + Giscus
     ═══════════════════════════════════════════ */
  function renderChatter() {
    showPage();
    currentView = 'chatter';
    updateActiveNav('chatter');
    document.title = '杂谈 | w1n8';

    let html = sectionHTML('云端杂谈', 'CHATTER — 共 ' + postList.length + ' 篇文章');

    if (postList.length === 0) {
      html += '<div class="post-list-empty">还没有文章，敬请期待。</div>';
    } else {
      html += '<ul class="post-list">';
      postList.forEach((post, index) => {
        html += '' +
          '<li onclick="window._openChatterArticle(' + index + ')">' +
            '<span class="post-date">' + post.date + '</span>' +
            '<span class="post-glyph">›</span>' +
            '<span class="post-title">' + post.title + '</span>' +
          '</li>';
      });
      html += '</ul>';
    }

    contentInner.innerHTML = html;
  }

  window._openChatterArticle = function(index) {
    openArticle(index, 'chatter');
  };

  /* ── Simple frontmatter parser ── */
  function parseFrontmatter(md) {
    const result = { title: '', date: '', time: '', tags: [], mood: '', content: md };
    const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return result;

    const fm = match[1];
    result.content = match[2] || md;

    let collectingTags = false;

    fm.split('\n').forEach(line => {
      var tagItem = line.match(/^\s+-\s+(.+)$/);
      if (collectingTags && tagItem) {
        result.tags.push(tagItem[1].trim().replace(/['"]/g, ''));
        return;
      }
      collectingTags = false;

      var kv = line.match(/^(\w+):\s*(.*)$/);
      if (!kv) return;
      var key = kv[1].trim();
      var val = kv[2].trim();

      if (key === 'tags') {
        if (val) {
          result.tags = val.replace(/[\[\]]/g, '').split(',').map(function(t) { return t.trim().replace(/['"]/g, ''); }).filter(Boolean);
        } else {
          collectingTags = true;
        }
      } else if (key === 'title') {
        result.title = val.replace(/['"]/g, '');
      } else if (key === 'date') {
        result.date = val;
      } else if (key === 'time') {
        result.time = val;
      } else if (key === 'mood') {
        result.mood = val;
      }
    });

    if (!result.title) {
      var h1 = result.content.match(/^#\s+(.+)$/m);
      if (h1) result.title = h1[1].trim();
    }

    return result;
  }

  /* ═══════════════════════════════════════════
     8. Friends (友链)
     ═══════════════════════════════════════════ */
  function renderFriends() {
    showPage();
    currentView = 'friends';
    updateActiveNav('friends');
    document.title = '友链 | w1n8';

    const friends = [
      { name: '青岑靶场', desc: 'CTF 在线练习平台', avatar: '🎯', url: 'https://ctf.qingcen.net/' }
    ];

    contentInner.innerHTML =
      sectionHTML('友链', 'FRIENDS — 伙伴们的角落') +
      '<div class="friends-grid">' +
        friends.map(f => '' +
          '<a href="' + f.url + '" target="_blank" rel="noopener" class="friend-card">' +
            '<div class="friend-avatar">' + f.avatar + '</div>' +
            '<div class="friend-info">' +
              '<div class="friend-name">' + f.name + '</div>' +
              '<div class="friend-desc">' + f.desc + '</div>' +
            '</div>' +
            '<span class="friend-arrow">→</span>' +
          '</a>'
        ).join('') +
      '</div>' +
      '<p style="text-align:center;margin-top:24px;color:var(--slate-500);font-size:13px;font-family:var(--font-serif)">' +
        '🍻 友链位招租中（V 我 50 详谈）' +
      '</p>';
  }

  /* ═══════════════════════════════════════════
     9. About
     ═══════════════════════════════════════════ */
  function renderAbout() {
    showPage();
    document.body.classList.add('route-about');
    currentView = 'about';
    updateActiveNav('about');
    document.title = '关于 | w1n8';

    contentInner.innerHTML =
      /* ── Floating keywords background ── */
      '<div class="about-bg-keywords" id="aboutBgKeywords"></div>' +

      /* ── Page wrapper ── */
      '<div class="about-wrapper">' +

        /* ── Profile Banner ── */
        '<div class="about-banner">' +
          '<div class="about-banner-avatar">' +
            '<img src="images/tomori.jpg" alt="w1n8">' +
            '<div class="about-banner-ring"></div>' +
          '</div>' +
          '<div class="about-banner-body">' +
            '<h1 class="about-banner-title">HELLO WORLD, I\'M <span class="about-accent">w1n8</span></h1>' +
            '<p class="about-banner-desc">网络空间安全专业本科生 · 在学 · 西安</p>' +
            '<p class="about-banner-bio">热爱代码与网络安全，正在一步一个脚印地学习成长。记录所学、分享所得，这个博客就是我的技术笔记本。</p>' +
            '<div class="about-banner-stats">' +
              '<div class="about-stat"><span class="about-stat-num">2+</span><span class="about-stat-label">Years Coding</span></div>' +
              '<div class="about-stat"><span class="about-stat-num">CTF</span><span class="about-stat-label">Beginner</span></div>' +
              '<div class="about-stat"><span class="about-stat-num">Xi\'an</span><span class="about-stat-label">Base</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* ── Expertise Grid ── */
        '<div class="about-grid">' +

          /* Research Direction */
          '<div class="about-card about-card--research">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">学习方向</h3>' +
            '<div class="about-research-items">' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9879;</span>' +
                '<span class="about-research-name">Web 安全</span>' +
                '<span class="about-research-desc">OWASP Top 10 · SQLi · XSS · CSRF</span>' +
              '</div>' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9760;</span>' +
                '<span class="about-research-name">CTF 入门</span>' +
                '<span class="about-research-desc">Web · Misc · 基础逆向</span>' +
              '</div>' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9881;</span>' +
                '<span class="about-research-name">技能积累</span>' +
                '<span class="about-research-desc">Linux · Python · 工具使用</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          /* Tech Stack Arsenal */
          '<div class="about-card about-card--arsenal">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">技术栈 · Toolbox</h3>' +
            '<div class="about-tags-cloud">' +
              '<span class="about-tag-pill">Linux</span>' +
              '<span class="about-tag-pill">Python</span>' +
              '<span class="about-tag-pill">Git</span>' +
              '<span class="about-tag-pill">Docker</span>' +
              '<span class="about-tag-pill">Burp Suite</span>' +
              '<span class="about-tag-pill">Nmap</span>' +
              '<span class="about-tag-pill">Wireshark</span>' +
              '<span class="about-tag-pill">SQLMap</span>' +
            '</div>' +
          '</div>' +

          /* Learning Roadmap */
          '<div class="about-card about-card--roadmap">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">学习路线</h3>' +
            '<div class="about-roadmap-list">' +
              '<div class="about-roadmap-item done">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Linux 基础 & Bash 脚本</span>' +
                  '<span class="about-roadmap-status done-text">已完成</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item done">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Web 安全基础 (OWASP Top 10)</span>' +
                  '<span class="about-roadmap-status done-text">已完成</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item active">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">CTF 入门练习</span>' +
                  '<div class="about-progress-bar"><div class="about-progress-fill" style="width:40%"></div></div>' +
                  '<span class="about-roadmap-status">40%</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Python 脚本编写</span>' +
                  '<span class="about-roadmap-status pending-text">进行中</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">漏洞复现与笔记整理</span>' +
                  '<span class="about-roadmap-status pending-text">日常积累</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* ── Giscus Comment Section ── */
        '<div class="about-comments" id="aboutComments">' +
          '<div class="about-comments-header">' +
            '<h3>留言板</h3>' +
            '<p>留下你的足迹，或者来交换友链 ~</p>' +
          '</div>' +
          '<div class="giscus" id="aboutGiscus"></div>' +
        '</div>' +
      '</div>';

    /* ── Floating keywords background ── */
    (function spawnKeywords() {
      var container = document.getElementById('aboutBgKeywords');
      if (!container) return;
      var words = ['HTTP', 'Linux', 'Python', 'SQL', 'XSS', 'CSRF', 'Docker', 'Git', 'Nmap', 'CTF', 'Shell', 'TCP/IP', 'Burp', 'Wireshark', 'localhost', 'learning', 'notes', 'growth'];
      var fragments = document.createDocumentFragment();
      for (var i = 0; i < 18; i++) {
        var el = document.createElement('span');
        el.className = 'about-kw';
        el.textContent = words[i];
        el.style.left = (Math.random() * 90) + '%';
        el.style.top = (Math.random() * 90) + '%';
        el.style.animationDelay = (Math.random() * 8) + 's';
        el.style.animationDuration = (10 + Math.random() * 14) + 's';
        el.style.fontSize = (0.9 + Math.random() * 1.6) + 'rem';
        fragments.appendChild(el);
      }
      container.appendChild(fragments);
    })();

    /* ── Load Giscus ── */
    if (_aboutGiscusTimer) clearTimeout(_aboutGiscusTimer);
    _aboutGiscusTimer = setTimeout(function() {
      loadGiscus(document.getElementById('aboutGiscus'), document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    }, 200);
  }

  /* ═══════════════════════════════════════════
     Button Bindings — all [data-action] elements
     ═══════════════════════════════════════════ */
  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;

      switch (action) {
        case 'home':     renderHome(); break;
        case 'projects': renderProjects(); break;
        case 'writeups': renderArchive(); break;
        case 'photos':   renderPhotos(); break;
        case 'music':    renderMusic(); break;
        case 'moments':  renderMoments(); break;
        case 'chatter':  renderChatter(); break;
        case 'friends':  renderFriends(); break;
        case 'about':    renderAbout(); break;
      }
    });
  });

  /* ── Logo click → Home ── */
  document.getElementById('navLogo').addEventListener('click', (e) => {
    e.preventDefault();
    renderHome();
  });
})();

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
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = h + ':' + m + ':' + s;
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
    fab.style.transform = 'scale(0)';
  }

  function closeMenu() {
    isOpen = false;
    backdrop.classList.remove('open');
    menu.classList.remove('open');
    fab.style.transform = 'scale(1)';
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

