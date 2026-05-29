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
  {
    title: 'Hack The Box · Misc 两题速记',
    date: '2026-05-27',
    filename: 'hackthebox.md',
    category: 'Practice',
    tags: ['HTB', 'Misc', 'Automation'],
    summary: '两道很适合练自动化思路的 Misc 小题，核心都是把重复交互抽象成脚本。'
  },
  {
    title: 'LitCTF 2026 · Web 题解',
    date: '2026-05-23',
    filename: 'LitCTF2026_WEB_WP.md',
    category: 'Web',
    tags: ['LitCTF', 'Web', 'Writeup'],
    summary: '从信息泄露点、利用链到复现步骤，整理两道 Web 题的完整解法。'
  },
  {
    title: 'LitCTF 2026 · Misc 题解',
    date: '2026-05-23',
    filename: 'LitCTF2026_MISC_WP.md',
    category: 'Misc',
    tags: ['LitCTF', 'Misc', 'Writeup'],
    summary: '覆盖 LSB、二维码修复、SSTV 等题型，适合当作一份 Misc 速查记录。'
  },
  {
    title: 'LitCTF 2026 · Crypto 题解',
    date: '2026-05-23',
    filename: 'LitCTF2026_crypto_WP.md',
    category: 'Crypto',
    tags: ['LitCTF', 'Crypto', 'Writeup'],
    summary: '记录 AES 爆破与题目分析过程，把关键脚本和思路留存下来。'
  },
  {
    title: '5 月 21 日刷题记录',
    date: '2026-05-21',
    filename: '5月21日刷题.md',
    category: 'Practice',
    tags: ['CTF', 'Practice', 'Notes'],
    summary: '当天刷题过程里的关键步骤、脚本片段和题目切入点整理。'
  },
  {
    title: '第一周学习记录',
    date: '2025-11-09',
    filename: 'week_1(November).md',
    category: 'Journal',
    tags: ['Weekly', 'Notes', 'Learning'],
    summary: '一周学习进度、方向选择和后续计划的阶段性记录。'
  }
];

/* ═══════════════════════════════════════════════════════════════
   Chatter Files — 说说页面的 Markdown 文件列表
   新增说说时：把新 md 文件的路径加到这个数组即可。
   ═══════════════════════════════════════════════════════════════ */
const chatterFiles = [
  'chatters/2026-05-12.md',
  'chatters/2026-05-14.md'
];

const chatterList = [
  { title: '继续把博客当成笔记本来写', date: '2026-05-14', filename: '2026-05-14.md', path: 'chatters/2026-05-14.md' },
  { title: '博客上线记录', date: '2026-05-12', filename: '2026-05-12.md', path: 'chatters/2026-05-12.md' }
];

const photoAlbum = {
  title: '日常相册',
  subtitle: '点开看看最近收藏和随手记录',
  photos: [
    { src: 'images/Yanami_1.JPG',  label: '' },
    { src: 'images/Yanami_2.PNG',  label: '' },
    { src: 'images/Yanami_3.PNG',  label: '' },
    { src: 'images/Yanami_4.JPG',  label: '' },
    { src: 'images/Yanami_5.JPG',  label: '' },
    { src: 'images/Yanami_6.JPG',  label: '' },
    { src: 'images/Yanami_7.JPG',  label: '' },
    { src: 'images/Yanami_8.JPG',  label: '' },
    { src: 'images/bg1.jpg',       label: '' },
    { src: 'images/bg2.jpg',       label: '' },
    { src: 'images/bg3.jpg',       label: '' },
    { src: 'images/bg4.jpg',       label: '' },
    { src: 'images/bg5.jpg',       label: '' },
    { src: 'images/bg6.jpg',       label: '' }
  ]
};

const siteStartDate = '2026-05-12T00:00:00';

let homeMomentsCache = [];
let archiveFilterState = { category: 'all', tag: 'all', search: '' };

function getArchivePosts() {
  return postList.map(function(post, index) {
    return Object.assign({ _index: index }, post);
  });
}

function getArchiveCategories(posts) {
  return Array.from(new Set(posts.map(function(post) {
    return post.category;
  }).filter(Boolean)));
}

function getArchiveTags(posts) {
  var tagSet = new Set();
  posts.forEach(function(post) {
    (post.tags || []).forEach(function(tag) {
      tagSet.add(tag);
    });
  });
  return Array.from(tagSet);
}

function filterArchivePosts(category, tag) {
  return getArchivePosts().filter(function(post) {
    var categoryMatch = !category || category === 'all' ? true : post.category === category;
    var tagMatch = !tag || tag === 'all' ? true : (post.tags || []).indexOf(tag) !== -1;
    return categoryMatch && tagMatch;
  });
}

function getLatestArchivePost(category, tag) {
  var posts = filterArchivePosts(category, tag);
  return posts.length ? posts[0] : null;
}

function mergeTags(primary, secondary) {
  var merged = [];
  (primary || []).concat(secondary || []).forEach(function(tag) {
    if (!tag) return;
    if (merged.indexOf(tag) === -1) merged.push(tag);
  });
  return merged;
}

function estimateReadingMinutes(text) {
  var normalized = stripMarkdown(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return 1;
  var length = normalized.length;
  return Math.max(1, Math.round(length / 320));
}

function getAdjacentContent(index, source) {
  var list = source === 'chatter' ? chatterList : postList;
  return {
    newer: index > 0 ? list[index - 1] : null,
    older: index < list.length - 1 ? list[index + 1] : null
  };
}

function getRelatedContent(post, index, source) {
  var list = source === 'chatter' ? chatterList : postList;
  if (source === 'chatter') {
    return list
      .map(function(item, itemIndex) {
        if (itemIndex === index) return null;
        return { item: item, index: itemIndex, score: 1 };
      })
      .filter(Boolean)
      .slice(0, 2);
  }

  return list
    .map(function(item, itemIndex) {
      if (itemIndex === index) return null;
      var sameCategory = item.category && post.category && item.category === post.category ? 2 : 0;
      var sharedTags = (item.tags || []).filter(function(tag) {
        return (post.tags || []).indexOf(tag) !== -1;
      }).length;
      return {
        item: item,
        index: itemIndex,
        score: sameCategory + sharedTags
      };
    })
    .filter(Boolean)
    .sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.date).getTime() - new Date(a.item.date).getTime();
    })
    .slice(0, 3);
}

const navSearchPages = [
  { type: 'page', title: '首页', meta: 'HOME', action: 'home', keywords: ['首页', 'home', '主页'] },
  { type: 'page', title: '项目', meta: 'PROJECTS', action: 'projects', keywords: ['项目', 'project', 'projects', '学习'] },
  { type: 'page', title: '归档', meta: 'ARCHIVE', action: 'writeups', keywords: ['归档', '文章', 'writeup', 'writeups', 'archive'] },
  { type: 'page', title: '照片墙', meta: 'PHOTOS', action: 'photos', keywords: ['照片', '相册', 'photos', 'photo'] },
  { type: 'page', title: '音乐', meta: 'MUSIC', action: 'music', keywords: ['音乐', 'music', '歌'] },
  { type: 'page', title: '说说', meta: 'MOMENTS', action: 'moments', keywords: ['说说', 'moments', '动态'] },
  { type: 'page', title: '杂谈', meta: 'CHATTER', action: 'chatter', keywords: ['杂谈', 'chatter', '博客'] },
  { type: 'page', title: '友链', meta: 'FRIENDS', action: 'friends', keywords: ['友链', 'friends'] },
  { type: 'page', title: '关于', meta: 'ABOUT', action: 'about', keywords: ['关于', 'about', '我'] }
];

function stripMarkdown(md) {
  return (md || '')
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtmlText(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeSearchText(text) {
  return String(text || '').toLowerCase().trim();
}

function slugifyHeading(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseFrontmatterBlock(md) {
  const result = { title: '', date: '', time: '', tags: [], mood: '', content: md };
  const match = md.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
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

function getRelativeTimeText(dateString) {
  if (!dateString) return '等待更新';
  var target = new Date(dateString);
  if (isNaN(target.getTime())) return dateString;

  var diff = Date.now() - target.getTime();
  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;

  if (diff < hour) return Math.max(1, Math.floor(diff / minute)) + ' 分钟前';
  if (diff < day) return Math.floor(diff / hour) + ' 小时前';
  if (diff < day * 30) return Math.floor(diff / day) + ' 天前';

  var y = target.getFullYear();
  var m = String(target.getMonth() + 1).padStart(2, '0');
  var d = String(target.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function getSiteUptimeText() {
  var start = new Date(siteStartDate);
  if (isNaN(start.getTime())) return '0 天';
  var diff = Date.now() - start.getTime();
  if (diff < 0) diff = 0;
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return days + ' 天 ' + hours + ' 小时';
}

async function loadHomeMoments() {
  if (homeMomentsCache.length) return homeMomentsCache;

  const moments = [];
  for (var i = 0; i < chatterFiles.length; i++) {
    var file = chatterFiles[i];
    try {
      var url = file + '?t=' + Date.now();
      var res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var md = await res.text();
      var fm = parseFrontmatterBlock(md);
      moments.push({
        filename: file,
        title: fm.title || '无标题说说',
        date: fm.date || '',
        time: fm.time || '',
        tags: fm.tags || [],
        content: fm.content || md
      });
    } catch (err) {
      console.warn('home moment load failed: ' + file, err);
    }
  }

  moments.sort(function(a, b) {
    var da = (a.date || '') + (a.time || '00:00');
    var db = (b.date || '') + (b.time || '00:00');
    if (da > db) return -1;
    if (da < db) return 1;
    return 0;
  });

  homeMomentsCache = moments;
  return moments;
}

async function buildSearchIndex() {
  var entries = navSearchPages.map(function(item) {
    return {
      type: item.type,
      title: item.title,
      meta: item.meta,
      action: item.action,
      desc: '快速跳转到这个页面，继续按栏目浏览内容。',
      keywords: item.keywords.join(' ')
    };
  });

  postList.forEach(function(post, index) {
    entries.push({
      type: 'post',
      title: post.title || '未命名文章',
      meta: (post.category || '文章') + ' · ' + (post.date || ''),
      desc: post.summary || ((post.tags || []).slice(0, 3).join(' · ') || '打开正文，继续看完整思路和过程记录。'),
      open: function() { window._openWriteupArticle(index); },
      keywords: [post.title, post.date, post.category, (post.tags || []).join(' '), post.summary, '文章', '归档', 'writeup'].join(' ')
    });
  });

  chatterList.forEach(function(post) {
    entries.push({
      type: 'chatter',
      title: post.title || '杂谈记录',
      meta: '杂谈 · ' + (post.date || ''),
      desc: '进入短记录正文，继续看完整内容。',
      open: function() { window._openChatterFile(post.path, post.title, post.date); },
      keywords: [post.title, post.date, '杂谈', 'chatter', '博客'].join(' ')
    });
  });

  try {
    var moments = await loadHomeMoments();
    moments.slice(0, 8).forEach(function(moment) {
      entries.push({
        type: 'moment',
        title: moment.title || stripMarkdown(moment.content).slice(0, 16) || '说说',
        meta: '说说 · ' + (moment.date || ''),
        action: 'moments',
        desc: stripMarkdown(moment.content).slice(0, 72) || '切换到说说页，看看最近的近况记录。',
        keywords: [moment.title, moment.date, (moment.tags || []).join(' '), stripMarkdown(moment.content).slice(0, 80), '说说'].join(' ')
      });
    });
  } catch (err) {}

  return entries;
}

async function hydrateHomePanels() {
  var writeupTitleEl = document.getElementById('featuredWriteupTitle');
  if (!writeupTitleEl) return;

  var writeupMetaEl = document.getElementById('featuredWriteupMeta');
  var writeupDescEl = document.getElementById('featuredWriteupDesc');
  var momentTitleEl = document.getElementById('featuredMomentTitle');
  var momentMetaEl = document.getElementById('featuredMomentMeta');
  var momentDescEl = document.getElementById('featuredMomentDesc');
  var storyPrimaryTitleEl = document.getElementById('homeStoryPrimaryTitle');
  var storyPrimaryMetaEl = document.getElementById('homeStoryPrimaryMeta');
  var storySecondaryTitleEl = document.getElementById('homeStorySecondaryTitle');
  var storySecondaryMetaEl = document.getElementById('homeStorySecondaryMeta');
  var storyTertiaryTitleEl = document.getElementById('homeStoryTertiaryTitle');
  var storyTertiaryMetaEl = document.getElementById('homeStoryTertiaryMeta');
  var topicHTBTitleEl = document.getElementById('homeTopicHTBTitle');
  var topicHTBMetaEl = document.getElementById('homeTopicHTBMeta');
  var topicWebTitleEl = document.getElementById('homeTopicWebTitle');
  var topicWebMetaEl = document.getElementById('homeTopicWebMeta');
  var topicEventTitleEl = document.getElementById('homeTopicEventTitle');
  var topicEventMetaEl = document.getElementById('homeTopicEventMeta');
  var topicNotesTitleEl = document.getElementById('homeTopicNotesTitle');
  var topicNotesMetaEl = document.getElementById('homeTopicNotesMeta');
  var albumTitleEl = document.getElementById('homeAlbumTitle');
  var albumMetaEl = document.getElementById('homeAlbumMeta');
  var thumbsEl = document.getElementById('homeGalleryThumbs');

  var postCountEl = document.getElementById('homePostCount');
  var momentCountEl = document.getElementById('homeMomentCount');
  var photoCountEl = document.getElementById('homePhotoCount');
  var lastUpdateEl = document.getElementById('homeLastUpdate');
  var uptimeEl = document.getElementById('homeUptime');
  var runtimeEl = document.getElementById('bentoRuntime');
  var pvInlineEl = document.getElementById('homePvInline');
  var currentFocusEl = document.getElementById('homeCurrentFocus');
  var currentFocusDescEl = document.getElementById('homeCurrentFocusDesc');

  var latestPost = postList[0];
  var secondPost = postList[1];
  var htbLatest = getLatestArchivePost('all', 'HTB');
  var webLatest = getLatestArchivePost('Web', 'all');
  var eventLatest = getLatestArchivePost('all', 'LitCTF');
  var notesLatest = getLatestArchivePost('Journal', 'all');
  var htbCount = filterArchivePosts('all', 'HTB').length;
  var webCount = filterArchivePosts('Web', 'all').length;
  var eventCount = filterArchivePosts('all', 'LitCTF').length;
  var notesCount = filterArchivePosts('Journal', 'all').length;

  function fillTopicCard(titleEl, metaEl, latestItem, count, fallbackTitle) {
    if (titleEl) {
      titleEl.textContent = latestItem ? latestItem.title : fallbackTitle;
    }
    if (metaEl) {
      metaEl.textContent = latestItem
        ? (count + ' 篇 · 最近更新于 ' + getRelativeTimeText(latestItem.date))
        : '这一条线暂时还没有整理好的内容';
    }
  }
  if (latestPost) {
    writeupTitleEl.textContent = latestPost.title || '未命名文章';
    writeupMetaEl.textContent = getRelativeTimeText(latestPost.date);
    writeupDescEl.textContent = latestPost.summary || '最近整理好的一篇题解或学习记录，点进去继续看完整过程。';
  } else {
    writeupTitleEl.textContent = '暂无文章';
    writeupMetaEl.textContent = '等待第一篇发布';
    writeupDescEl.textContent = '第一篇文章发布后，这里会自动接住最近整理好的内容。';
  }

  if (storyPrimaryTitleEl) {
    storyPrimaryTitleEl.textContent = latestPost ? latestPost.title : '从第一篇文章开始逛';
  }
  if (storyPrimaryMetaEl) {
    storyPrimaryMetaEl.textContent = latestPost ? ((latestPost.category || '文章') + ' · ' + getRelativeTimeText(latestPost.date)) : '最近整理好的一篇文章';
  }
  if (storySecondaryTitleEl) {
    storySecondaryTitleEl.textContent = secondPost ? secondPost.title : '去归档里继续往下逛';
  }
  if (storySecondaryMetaEl) {
    storySecondaryMetaEl.textContent = secondPost ? ((secondPost.category || '文章') + ' · ' + getRelativeTimeText(secondPost.date)) : '看看更多题解和学习记录';
  }
  if (storyTertiaryTitleEl) {
    storyTertiaryTitleEl.textContent = '我现在主要在补 Web 安全和 CTF';
  }
  if (storyTertiaryMetaEl) {
    storyTertiaryMetaEl.textContent = '去关于页看当前路线、工具栈和学习重点';
  }
  fillTopicCard(topicHTBTitleEl, topicHTBMetaEl, htbLatest, htbCount, 'HTB 相关内容还在整理');
  fillTopicCard(topicWebTitleEl, topicWebMetaEl, webLatest, webCount, 'Web 题解会集中放在这里');
  fillTopicCard(topicEventTitleEl, topicEventMetaEl, eventLatest, eventCount, '比赛专题会逐步堆起来');
  fillTopicCard(topicNotesTitleEl, topicNotesMetaEl, notesLatest, notesCount, '学习记录会放在这一条线');

  albumTitleEl.textContent = photoAlbum.title;
  albumMetaEl.textContent = '共 ' + photoAlbum.photos.length + ' 张，' + photoAlbum.subtitle;
  thumbsEl.innerHTML = photoAlbum.photos.slice(0, 3).map(function(photo) {
    return '<img src="' + photo.src + '" alt="" loading="lazy">';
  }).join('');

  postCountEl.textContent = String(postList.length);
  photoCountEl.textContent = String(photoAlbum.photos.length);
  uptimeEl.textContent = getSiteUptimeText();
  if (runtimeEl) runtimeEl.textContent = 'UP ' + getSiteUptimeText();

  var latestDates = [];
  if (latestPost && latestPost.date) latestDates.push(latestPost.date);

  try {
    var moments = await loadHomeMoments();
    momentCountEl.textContent = String(moments.length);

    if (moments[0]) {
      var latestMoment = moments[0];
      var momentDatetime = latestMoment.date + (latestMoment.time ? 'T' + latestMoment.time : '');
      if (latestMoment.date) latestDates.push(momentDatetime);

      momentTitleEl.textContent = latestMoment.title || '最新说说';
      momentMetaEl.textContent = getRelativeTimeText(momentDatetime || latestMoment.date);
      momentDescEl.textContent = stripMarkdown(latestMoment.content).slice(0, 72) || '最近的想法和小记录会显示在这里。';
      if (currentFocusEl) currentFocusEl.textContent = latestPost ? ('最近在整理：' + latestPost.title) : '最近在补 Web 安全和 CTF';
      if (currentFocusDescEl) currentFocusDescEl.textContent = '最新近况：' + (latestMoment.title || stripMarkdown(latestMoment.content).slice(0, 26));
    } else {
      momentTitleEl.textContent = '暂无说说';
      momentMetaEl.textContent = '等待下一条记录';
      momentDescEl.textContent = '写下一条新的近况后，这里会自动出现摘要。';
      if (currentFocusEl) currentFocusEl.textContent = latestPost ? ('最近在整理：' + latestPost.title) : '最近在补 Web 安全和 CTF';
      if (currentFocusDescEl) currentFocusDescEl.textContent = '如果你是第一次来，首页会优先展示最近整理和长期主线。';
    }
  } catch (err) {
    momentCountEl.textContent = '0';
    momentTitleEl.textContent = '近况读取失败';
    momentMetaEl.textContent = '请检查 chatters 目录';
    momentDescEl.textContent = '当前无法读取近况记录，但其他页面不受影响。';
    if (currentFocusEl) currentFocusEl.textContent = latestPost ? ('最近在整理：' + latestPost.title) : '最近在补 Web 安全和 CTF';
    if (currentFocusDescEl) currentFocusDescEl.textContent = '近况读取失败时，建议先从归档和关于页进入。';
  }

  if (latestDates.length) {
    latestDates.sort(function(a, b) {
      return new Date(b).getTime() - new Date(a).getTime();
    });
    lastUpdateEl.textContent = getRelativeTimeText(latestDates[0]);
  } else {
    lastUpdateEl.textContent = '等待同步';
  }

  if (pvInlineEl) {
    var syncPv = function() {
      var pv = document.getElementById('busuanzi_value_site_pv');
      if (pv && pv.textContent && pv.textContent !== '--') {
        pvInlineEl.textContent = pv.textContent + ' visits';
      }
    };
    syncPv();
    setTimeout(syncPv, 1200);
    setTimeout(syncPv, 4000);
  }

  var featuredWriteupCard = document.getElementById('featuredWriteupCard');
  var featuredMomentCard = document.getElementById('featuredMomentCard');
  var homeGalleryLink = document.getElementById('homeGalleryLink');
  var storyPrimaryCard = document.getElementById('homeStoryPrimary');
  var storySecondaryCard = document.getElementById('homeStorySecondary');
  var storyTertiaryCard = document.getElementById('homeStoryTertiary');
  var homeTopicHTBCard = document.getElementById('homeTopicHTB');
  var homeTopicWebCard = document.getElementById('homeTopicWeb');
  var homeTopicEventCard = document.getElementById('homeTopicEvent');
  var homeTopicNotesCard = document.getElementById('homeTopicNotes');

  if (featuredWriteupCard) {
    featuredWriteupCard.onclick = function() {
      if (postList.length > 0 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(0);
    };
  }
  if (featuredMomentCard) {
    featuredMomentCard.onclick = function() {
      if (typeof window.renderMoments === 'function') window.renderMoments();
    };
  }
  if (homeGalleryLink) {
    homeGalleryLink.onclick = function() {
      if (typeof window.renderPhotoAlbum === 'function') window.renderPhotoAlbum();
    };
  }
  if (storyPrimaryCard) {
    storyPrimaryCard.onclick = function() {
      if (postList.length > 0 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(0);
    };
  }
  if (storySecondaryCard) {
    storySecondaryCard.onclick = function() {
      if (postList.length > 1 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(1);
      if (typeof window.renderArchive === 'function') return window.renderArchive();
    };
  }
  if (storyTertiaryCard) {
    storyTertiaryCard.onclick = function() {
      if (typeof window.renderAbout === 'function') return window.renderAbout();
    };
  }
  if (homeTopicHTBCard) {
    homeTopicHTBCard.onclick = function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('all', 'HTB');
    };
  }
  if (homeTopicWebCard) {
    homeTopicWebCard.onclick = function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('Web', 'all');
    };
  }
  if (homeTopicEventCard) {
    homeTopicEventCard.onclick = function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('all', 'LitCTF');
    };
  }
  if (homeTopicNotesCard) {
    homeTopicNotesCard.onclick = function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('Journal', 'all');
    };
  }
}

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
  var _articleScrollHandler = null;

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
    if (_articleScrollHandler) {
      articleBody.removeEventListener('scroll', _articleScrollHandler);
      _articleScrollHandler = null;
    }
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
  function renderHome() {
    showHome();
    hydrateHomePanels();
  }

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
        desc: '用来集中整理题解、Web 安全学习笔记、界面实验和阶段性总结的个人博客。这个站点本身既是展示页，也是我长期维护的练习场。',
        tags: ['HTML', 'CSS', 'JavaScript', 'Markdown', 'CTF', 'Web Security'],
        liveUrl: 'https://win8Morean.github.io',
        repoUrl: 'https://github.com/win8Morean/win8Morean.github.io'
      }
    ];

    contentInner.innerHTML =
      sectionHTML('PROJECTS MATRIX', '项目矩阵') +
      '<div class="showcase-hero showcase-hero--projects">' +
        '<div class="showcase-hero-main">' +
          '<span class="archive-kicker">Build Notes</span>' +
          '<h3 class="showcase-hero-title">把博客当成一个长期维护的实验场</h3>' +
          '<p class="showcase-hero-desc">除了发文章，我也会把页面细节、内容组织和交互体验都当成项目的一部分慢慢打磨。</p>' +
        '</div>' +
        '<div class="showcase-stat-strip">' +
          '<div class="showcase-stat-card"><strong>' + projects.length + '</strong><span>PROJECTS</span></div>' +
          '<div class="showcase-stat-card"><strong>' + projects[0].tags.length + '</strong><span>STACK TAGS</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="projects-showcase">' +
        projects.map(function(p) {
          return '' +
            '<article class="project-showcase-card">' +
              '<div class="project-showcase-head">' +
                '<div class="project-showcase-mark">' + p.icon + '</div>' +
                '<div class="project-showcase-meta">' +
                  '<span class="project-showcase-kicker">FLAGSHIP</span>' +
                  '<h3 class="project-showcase-title">' + p.name + '</h3>' +
                '</div>' +
              '</div>' +
              '<p class="project-showcase-desc">' + p.desc + '</p>' +
              '<div class="project-showcase-tags">' +
                p.tags.map(function(t) {
                  return '<span class="project-showcase-tag">' + t + '</span>';
                }).join('') +
              '</div>' +
              '<div class="project-showcase-actions">' +
                '<a class="project-showcase-btn project-showcase-btn--primary" href="' + p.liveUrl + '" target="_blank" rel="noopener">在线预览</a>' +
                '<a class="project-showcase-btn" href="' + p.repoUrl + '" target="_blank" rel="noopener">查看源码</a>' +
              '</div>' +
            '</article>';
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
    var allPosts = getArchivePosts();
    var total = allPosts.length;
    var categories = getArchiveCategories(allPosts);
    var categoryPosts = archiveFilterState.category === 'all'
      ? allPosts
      : allPosts.filter(function(post) {
          return post.category === archiveFilterState.category;
        });
    var availableTags = getArchiveTags(categoryPosts);
    if (archiveFilterState.tag !== 'all' && availableTags.indexOf(archiveFilterState.tag) === -1) {
      archiveFilterState.tag = 'all';
    }
    var filteredPosts = archiveFilterState.tag === 'all'
      ? categoryPosts
      : categoryPosts.filter(function(post) {
          return (post.tags || []).indexOf(archiveFilterState.tag) !== -1;
        });
    var query = normalizeSearchText(archiveFilterState.search || '');
    if (query) {
      filteredPosts = filteredPosts.filter(function(post) {
        var searchable = [
          post.title,
          post.summary,
          post.category,
          (post.tags || []).join(' '),
          post.filename
        ].join(' ');
        return normalizeSearchText(searchable).includes(query);
      });
    }
    var latest = filteredPosts[0] || allPosts[0] || null;
    var currentViewLabel = archiveFilterState.category === 'all' ? '全部分类' : archiveFilterState.category;
    if (archiveFilterState.tag !== 'all') currentViewLabel += ' · #' + archiveFilterState.tag;
    if (archiveFilterState.search) currentViewLabel += ' · 搜索 "' + archiveFilterState.search + '"';

    contentInner.innerHTML =
      sectionHTML('归档', 'ARCHIVE — 题解、笔记与阶段性总结') +
      '<div class="archive-hero">' +
        '<div class="archive-hero-main">' +
          '<span class="archive-kicker">Latest Dispatch</span>' +
          '<h3 class="archive-hero-title">' + (latest ? latest.title : '还没有归档内容') + '</h3>' +
          '<p class="archive-hero-desc">' + (latest ? (latest.summary || '最近整理好的一篇题解或学习记录已经归档，点开继续看完整过程。') : '第一篇文章发布后，这里会慢慢长成我的长期归档。') + '</p>' +
          '<div class="archive-hero-meta">' +
            '<span>总计 ' + total + ' 篇</span>' +
            '<span>当前视图 · ' + currentViewLabel + '</span>' +
            '<span>' + (latest ? latest.date : '等待更新') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="archive-hero-side">' +
          '<div class="archive-side-card">' +
            '<span class="archive-side-num">' + total + '</span>' +
            '<span class="archive-side-label">ARTICLES</span>' +
          '</div>' +
          '<div class="archive-side-card">' +
            '<span class="archive-side-num">' + filteredPosts.length + '</span>' +
            '<span class="archive-side-label">IN VIEW</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (
        total === 0
          ? ''
          : '<div class="archive-filters-wrap">' +
              '<div class="archive-search-box">' +
                '<svg class="archive-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' +
                '</svg>' +
                '<input class="archive-search-input" id="archiveSearchInput" type="text" value="' + escapeHtmlText(archiveFilterState.search || '') + '" placeholder="搜索标题、摘要、分类、标签...">' +
                '<button class="archive-search-clear" id="archiveSearchClear" type="button">清空</button>' +
              '</div>' +
              '<div class="archive-filter-group">' +
                '<span class="archive-filter-label">分类</span>' +
                '<div class="archive-filters">' +
                  '<button class="archive-pill' + (archiveFilterState.category === 'all' ? ' active' : '') + '" type="button" onclick="window.setArchiveCategoryFilter(\'all\')">全部</button>' +
                  categories.map(function(category) {
                    return '<button class="archive-pill' + (archiveFilterState.category === category ? ' active' : '') + '" type="button" onclick="window.setArchiveCategoryFilter(' + JSON.stringify(category) + ')">' + category + '</button>';
                  }).join('') +
                '</div>' +
              '</div>' +
              '<div class="archive-filter-group">' +
                '<span class="archive-filter-label">标签</span>' +
                '<div class="archive-filters archive-filters--tags">' +
                  '<button class="archive-pill' + (archiveFilterState.tag === 'all' ? ' active' : '') + '" type="button" onclick="window.setArchiveTagFilter(\'all\')">全部</button>' +
                  availableTags.map(function(tag) {
                    return '<button class="archive-pill' + (archiveFilterState.tag === tag ? ' active' : '') + '" type="button" onclick="window.setArchiveTagFilter(' + JSON.stringify(tag) + ')">#' + tag + '</button>';
                  }).join('') +
                '</div>' +
              '</div>' +
              '<div class="archive-filter-summary">当前显示 ' + filteredPosts.length + ' / ' + total + ' 篇内容</div>' +
            '</div>'
      ) +
      (
        total === 0
          ? '<div class="archive-empty">暂无归档内容</div>'
          : filteredPosts.length === 0
            ? '<div class="archive-empty">当前筛选下还没有结果，试试切换分类、标签或搜索词。</div>'
          : '<div class="archive-stream">' +
              filteredPosts.map(function(post) {
                var badges = '<span class="archive-entry-badge archive-entry-badge--category">' + (post.category || 'Article') + '</span>' +
                  (post.tags || []).slice(0, 3).map(function(tag) {
                    return '<span class="archive-entry-badge">#' + tag + '</span>';
                  }).join('');
                return '' +
                  '<button class="archive-entry" type="button" onclick="window._openWriteupArticle(' + post._index + ')">' +
                    '<div class="archive-entry-date">' + (post.date || '--') + '</div>' +
                    '<div class="archive-entry-body">' +
                      '<div class="archive-entry-top"><div class="archive-entry-badges">' + badges + '</div></div>' +
                      '<h3 class="archive-entry-title">' + post.title + '</h3>' +
                      '<p class="archive-entry-desc">' + (post.summary || '点开进入正文，查看完整思路、过程记录和关键细节。') + '</p>' +
                    '</div>' +
                    '<div class="archive-entry-arrow">↗</div>' +
                  '</button>';
              }).join('') +
            '</div>'
      );

    var archiveSearchInput = document.getElementById('archiveSearchInput');
    var archiveSearchClear = document.getElementById('archiveSearchClear');
    if (archiveSearchInput) {
      archiveSearchInput.addEventListener('input', function() {
        archiveFilterState.search = archiveSearchInput.value;
        renderArchive();
        setTimeout(function() {
          var nextInput = document.getElementById('archiveSearchInput');
          if (!nextInput) return;
          nextInput.focus();
          nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
        }, 0);
      });
    }
    if (archiveSearchClear) {
      archiveSearchClear.addEventListener('click', function() {
        archiveFilterState.search = '';
        renderArchive();
      });
    }
  }

  /* ── Article Reader (shared by Writeups & Chatter) ── */
  async function openArticle(index, source) {
    const isChatter = source === 'chatter';
    const post = isChatter ? chatterList[index] : postList[index];
    const basePath = isChatter ? 'chatters/' : 'posts/';
    const filename = isChatter
      ? (post.path ? post.path.split('/').pop() : post.filename)
      : post.filename;
    const sectionName = isChatter ? '云端杂谈' : '归档文章';

    articlePath.textContent = '~/' + source + '/' + filename;
    articleBody.innerHTML = '<div class="article-loading">Loading ' + filename + ' ...</div>';
    currentWriteupIndex = index;
    showArticle();

    try {
      const res = await fetch(isChatter && post.path ? post.path : (basePath + filename));
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const md = await res.text();
      const fm = parseFrontmatterBlock(md);
      const articleTitle = fm.title || post.title || '未命名文章';
      const articleDate = fm.date || post.date || '--';
      const articleTags = mergeTags(post.tags, fm.tags);
      const articleContent = fm.content || md;
      const articleText = stripMarkdown(articleContent);
      const articleHtml = marked.parse(articleContent);
      const articleDoc = new DOMParser().parseFromString('<div class="article-prose-root">' + articleHtml + '</div>', 'text/html');
      const headingNodes = Array.from(articleDoc.querySelectorAll('h2, h3'));
      const articleOutline = headingNodes.map(function(heading, headingIndex) {
        var text = (heading.textContent || '').trim();
        var id = 'article-heading-' + headingIndex + '-' + slugifyHeading(text || ('section-' + headingIndex));
        heading.id = id;
        return {
          id: id,
          text: text,
          level: heading.tagName.toLowerCase()
        };
      });
      const articleProseHtml = articleDoc.querySelector('.article-prose-root').innerHTML;
      const readingMinutes = estimateReadingMinutes(articleText);
      const categoryLabel = isChatter ? 'Chatter' : (post.category || 'Article');
      const adjacent = getAdjacentContent(index, source);
      const related = getRelatedContent(Object.assign({}, post, { tags: articleTags }), index, source);
      const articleBadges = [
        '<span class="article-meta-badge article-meta-badge--category">' + escapeHtmlText(categoryLabel) + '</span>'
      ].concat(articleTags.slice(0, 5).map(function(tag) {
        return '<span class="article-meta-badge">#' + escapeHtmlText(tag) + '</span>';
      })).join('');
      const adjacentHtml = [adjacent.newer, adjacent.older].filter(Boolean).map(function(item, itemOffset) {
        var targetIndex = itemOffset === 0 && adjacent.newer ? index - 1 : index + 1;
        var targetSource = source;
        var label = targetIndex < index ? '较新的内容' : '继续往后看';
        var meta = item.date || '--';
        var onclick = targetSource === 'chatter'
          ? 'window._openChatterArticle(' + targetIndex + ')'
          : 'window._openWriteupArticle(' + targetIndex + ')';
        return '' +
          '<button class="article-nav-card" type="button" onclick="' + onclick + '">' +
            '<span class="article-nav-label">' + label + '</span>' +
            '<strong class="article-nav-title">' + escapeHtmlText(item.title || '未命名内容') + '</strong>' +
            '<span class="article-nav-meta">' + escapeHtmlText(meta) + '</span>' +
          '</button>';
      }).join('');
      const relatedHtml = related.map(function(entry) {
        var item = entry.item;
        var onclick = source === 'chatter'
          ? 'window._openChatterArticle(' + entry.index + ')'
          : 'window._openWriteupArticle(' + entry.index + ')';
        var relatedBadges = [];
        if (source !== 'chatter' && item.category) {
          relatedBadges.push('<span class="article-related-badge article-related-badge--category">' + escapeHtmlText(item.category) + '</span>');
        }
        (item.tags || []).slice(0, 2).forEach(function(tag) {
          relatedBadges.push('<span class="article-related-badge">#' + escapeHtmlText(tag) + '</span>');
        });
        return '' +
          '<button class="article-related-card" type="button" onclick="' + onclick + '">' +
            '<div class="article-related-top">' + relatedBadges.join('') + '</div>' +
            '<strong class="article-related-title">' + escapeHtmlText(item.title || '未命名内容') + '</strong>' +
            '<p class="article-related-desc">' + escapeHtmlText(item.summary || '继续阅读相关内容。') + '</p>' +
            '<span class="article-related-meta">' + escapeHtmlText(item.date || '--') + '</span>' +
          '</button>';
      }).join('');
      const outlineHtml = articleOutline.length
        ? '<aside class="article-outline-card">' +
            '<div class="article-outline-head">' +
              '<span class="article-section-kicker">ON THIS PAGE</span>' +
              '<strong class="article-outline-title">目录</strong>' +
            '</div>' +
            '<div class="article-outline-links">' +
              articleOutline.map(function(item) {
                return '<button class="article-outline-link article-outline-link--' + item.level + '" type="button" data-target="' + item.id + '">' + escapeHtmlText(item.text) + '</button>';
              }).join('') +
            '</div>' +
          '</aside>'
        : '';

      const articleDiv = document.createElement('div');
      articleDiv.className = 'article-content';
      articleDiv.innerHTML =
        '<div class="article-lead">' +
          '<span class="article-kicker">' + sectionName + '</span>' +
          '<h1 class="article-cover-title">' + escapeHtmlText(articleTitle) + '</h1>' +
          '<div class="article-cover-meta">' +
            '<span>' + escapeHtmlText(articleDate) + '</span>' +
            '<span>' + readingMinutes + ' min read</span>' +
            '<span>' + escapeHtmlText(filename) + '</span>' +
          '</div>' +
          '<div class="article-progress"><span class="article-progress-fill" id="articleProgressFill"></span></div>' +
          '<div class="article-meta-badges">' + articleBadges + '</div>' +
        '</div>' +
        '<div class="article-layout">' +
          outlineHtml +
          '<div class="article-main">' +
            '<div class="article-prose">' + articleProseHtml + '</div>' +
        (
          adjacentHtml
            ? '<div class="article-nav-grid">' + adjacentHtml + '</div>'
            : ''
        ) +
        (
          relatedHtml
            ? '<div class="article-related-section">' +
                '<div class="article-section-head">' +
                  '<span class="article-section-kicker">KEEP READING</span>' +
                  '<h3 class="article-section-title">' + (isChatter ? '继续看看其他记录' : '相关文章') + '</h3>' +
                '</div>' +
                '<div class="article-related-grid">' + relatedHtml + '</div>' +
              '</div>'
            : ''
        ) +
          '</div>' +
        '</div>';

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
      if (_articleScrollHandler) {
        articleBody.removeEventListener('scroll', _articleScrollHandler);
      }
      var progressFill = articleDiv.querySelector('#articleProgressFill');
      var outlineLinks = Array.from(articleDiv.querySelectorAll('.article-outline-link'));
      var outlineTargets = outlineLinks.map(function(link) {
        return articleDiv.querySelector('#' + link.dataset.target);
      });
      outlineLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          var target = articleDiv.querySelector('#' + link.dataset.target);
          if (!target) return;
          articleBody.scrollTo({
            top: Math.max(0, target.offsetTop - 110),
            behavior: 'smooth'
          });
        });
      });
      _articleScrollHandler = function() {
        var maxScroll = articleBody.scrollHeight - articleBody.clientHeight;
        var ratio = maxScroll > 0 ? Math.min(1, Math.max(0, articleBody.scrollTop / maxScroll)) : 0;
        if (progressFill) progressFill.style.transform = 'scaleX(' + ratio + ')';
        if (!outlineLinks.length) return;
        var activeIndex = 0;
        outlineTargets.forEach(function(target, targetIndex) {
          if (target && target.offsetTop - 130 <= articleBody.scrollTop) {
            activeIndex = targetIndex;
          }
        });
        outlineLinks.forEach(function(link, linkIndex) {
          link.classList.toggle('active', linkIndex === activeIndex);
        });
      };
      articleBody.addEventListener('scroll', _articleScrollHandler, { passive: true });
      _articleScrollHandler();
    } catch (err) {
      articleBody.innerHTML = '' +
        '<div class="post-list-empty">' +
          '加载失败: ' + filename + '<br>' +
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
      sectionHTML('光影画廊', 'PHOTOS — 收藏、随手记录与一些喜欢的画面') +
      '<div class="photo-album-card" onclick="renderPhotoAlbum()">' +
        '<div class="photo-stack-wrap">' +
          '<img src="' + photoAlbum.photos[0].src + '" alt="' + photoAlbum.title + '">' +
          '<img src="' + photoAlbum.photos[3].src + '" alt="' + photoAlbum.title + '">' +
        '</div>' +
        '<div class="photo-album-name">' + photoAlbum.title + '</div>' +
        '<div class="photo-album-count">共 ' + photoAlbum.photos.length + ' 张 · 点击查看相册</div>' +
      '</div>' +
      '<p style="text-align:center;margin-top:24px;color:var(--slate-500);font-size:13px;font-family:var(--font-serif)">' +
        '照片会继续慢慢补，先把值得留下来的片段存起来。' +
      '</p>';
  }

  /* ── Album detail: show all photos ── */
  function renderPhotoAlbum() {
    showPage();
    currentView = 'photos';
    updateActiveNav('photos');
    document.title = photoAlbum.title + ' | w1n8';

    contentInner.innerHTML =
      '<div class="album-detail-header">' +
        '<button class="album-back-btn" id="albumBackBtn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          '<span>返回相册</span>' +
        '</button>' +
        '<div class="album-detail-info">' +
          '<span class="album-detail-name">' + photoAlbum.title + '</span>' +
          '<span class="album-detail-count">共 ' + photoAlbum.photos.length + ' 张</span>' +
        '</div>' +
      '</div>' +
      '<div class="photos-grid">' +
        photoAlbum.photos.map(p => '' +
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
  window.renderMoments = renderMoments;
  window.renderArchive = renderArchive;
  window.renderAbout = renderAbout;
  window.setArchiveCategoryFilter = function(category) {
    archiveFilterState.category = category || 'all';
    var categoryPosts = archiveFilterState.category === 'all'
      ? getArchivePosts()
      : getArchivePosts().filter(function(post) {
          return post.category === archiveFilterState.category;
        });
    var availableTags = getArchiveTags(categoryPosts);
    if (archiveFilterState.tag !== 'all' && availableTags.indexOf(archiveFilterState.tag) === -1) {
      archiveFilterState.tag = 'all';
    }
    renderArchive();
  };
  window.setArchiveTagFilter = function(tag) {
    archiveFilterState.tag = tag || 'all';
    renderArchive();
  };
  window.openArchivePreset = function(category, tag) {
    archiveFilterState.category = category || 'all';
    archiveFilterState.tag = tag || 'all';
    archiveFilterState.search = '';
    renderArchive();
  };
  window._openWriteupArticle = function(index) {
    openArticle(index, 'writeups');
  };

  /* ═══════════════════════════════════════════
     5. Music — embedded BGM player page
     ═══════════════════════════════════════════ */
  function renderMusic() {
    showPage();
    currentView = 'music';
    updateActiveNav('music');
    document.title = '音乐 | w1n8';

    contentInner.innerHTML =
      sectionHTML('音乐馆', 'MUSIC — 用来边写边放空的背景声') +
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
      sectionHTML('说说', 'MOMENTS — 近况、碎片和临时想法') +
      '<div class="moments-shell">' +
        '<div class="moments-shell-head">' +
          '<div class="moments-shell-copy">' +
            '<span class="archive-kicker">Live Fragments</span>' +
            '<h3 class="moments-shell-title">最近的想法和碎片</h3>' +
            '<p class="moments-shell-desc">更轻、更短，也更接近当下的状态记录。</p>' +
          '</div>' +
        '</div>' +
        '<div class="moments-list" id="momentsList">' +
        '<div class="moments-loading">' +
          '<div class="moments-loading-spin"></div>' +
          '<p>加载说说中...</p>' +
        '</div>' +
        '</div>' +
      '</div>';

    loadMoments();
  }

  async function loadMoments() {
    const container = document.getElementById('momentsList');
    if (!container) return;

    const moments = [];

    for (var i = 0; i < chatterFiles.length; i++) {
      var file = chatterFiles[i];
      console.log('loading chatter: ' + file);
      try {
        var url = file + '?t=' + Date.now();
        var res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText);
        var md = await res.text();
        var fm = parseFrontmatter(md);
        moments.push({
          filename: file,
          title: fm.title || '',
          date: fm.date || '',
          time: fm.time || '',
          tags: fm.tags || [],
          content: fm.content || md
        });
        console.log('chatter loaded: ' + file);
      } catch (err) {
        console.warn('chatter load failed: ' + file, err);
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
      container.innerHTML = '<div class="post-list-empty">还没有新的近况记录，先去看看归档和专题入口也不错。</div>';
      return;
    }

    container.innerHTML = moments.map(function(m, index) {
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

      var titleHTML = '';
      if (m.title) {
        titleHTML = '<h3 class="moment-title">' + m.title + '</h3>';
      }

      return '' +
        '<div class="moment-card">' +
          '<div class="moment-rail">' +
            '<span class="moment-rail-dot"></span>' +
            '<span class="moment-rail-line' + (index === moments.length - 1 ? ' is-last' : '') + '"></span>' +
          '</div>' +
          '<div class="moment-header">' +
            '<div class="moment-avatar">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
            '</div>' +
            '<div class="moment-meta">' +
              '<span class="moment-author">w1n8</span>' +
              '<span class="moment-time">' + dateDisplay + '</span>' +
            '</div>' +
          '</div>' +
          titleHTML +
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

    let html = sectionHTML('随手杂谈', 'CHATTER — 共 ' + chatterList.length + ' 篇短记录');

    if (chatterList.length === 0) {
      html += '<div class="post-list-empty">还没有文章，敬请期待。</div>';
    } else {
      html +=
        '<div class="chatter-board">' +
          chatterList.map(function(post, index) {
            return '' +
              '<button class="chatter-note" type="button" onclick="window._openChatterArticle(' + index + ')">' +
                '<div class="chatter-note-head">' +
                  '<span class="chatter-note-date">' + (post.date || '--') + '</span>' +
                  '<span class="chatter-note-badge">NOTE</span>' +
                '</div>' +
                '<h3 class="chatter-note-title">' + post.title + '</h3>' +
                '<p class="chatter-note-desc">一些不适合写成长文、但值得单独记下来的片段。</p>' +
                '<div class="chatter-note-foot">' +
                  '<span class="chatter-note-cta">展开记录</span>' +
                  '<span class="chatter-note-arrow">→</span>' +
                '</div>' +
              '</button>';
          }).join('') +
        '</div>';
    }

    contentInner.innerHTML = html;
  }

  window._openChatterArticle = function(index) {
    openArticle(index, 'chatter');
  };
  window._openChatterFile = function(path, title, date) {
    var idx = chatterList.findIndex(function(item) { return item.path === path; });
    if (idx >= 0) return openArticle(idx, 'chatter');
  };

  /* ── Simple frontmatter parser ── */
  function parseFrontmatter(md) {
    return parseFrontmatterBlock(md);
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
      { name: '青岑靶场', desc: '在线 CTF 练习平台，适合日常刷题和打基本功。', avatar: '🎯', url: 'https://ctf.qingcen.net/' },
      { name: 'tooki', desc: '偏向 Pwn 方向的个人博客，记录题解、学习笔记和实战经验。', avatar: '', image: 'images/tooki.jpg', url: 'https://tooki-blog.vercel.app/' },
      { name: 'UKY', desc: 'Web 大手子', avatar: '', image: 'images/uky.jpg', url: 'https://www.uky.show/' }
    ];

    contentInner.innerHTML =
      sectionHTML('友链', 'FRIENDS — 我会反复回访的站点角落') +
      '<div class="showcase-hero showcase-hero--friends">' +
        '<div class="showcase-hero-main">' +
          '<span class="archive-kicker">Companions</span>' +
          '<h3 class="showcase-hero-title">一起折腾技术，也认真记录各自轨迹的朋友们</h3>' +
          '<p class="showcase-hero-desc">这些链接不只是跳转入口，更像是我平时会反复回访、顺手看看近况的长期据点。</p>' +
        '</div>' +
        '<div class="showcase-stat-strip">' +
          '<div class="showcase-stat-card"><strong>' + friends.length + '</strong><span>FRIENDS</span></div>' +
          '<div class="showcase-stat-card"><strong>OPEN</strong><span>APPLY</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="friends-showcase">' +
        friends.map(f => '' +
          '<a href="' + f.url + '" target="_blank" rel="noopener" class="friend-showcase-card">' +
            '<div class="friend-showcase-mark' + (f.image ? ' friend-showcase-mark--image' : '') + '">' +
              (f.image
                ? '<img src="' + f.image + '" alt="' + f.name + ' avatar" class="friend-showcase-photo">'
                : f.avatar) +
            '</div>' +
            '<div class="friend-showcase-body">' +
              '<span class="friend-showcase-kicker">FRIEND LINK</span>' +
              '<h3 class="friend-showcase-title">' + f.name + '</h3>' +
              '<p class="friend-showcase-desc">' + f.desc + '</p>' +
            '</div>' +
            '<span class="friend-showcase-arrow">↗</span>' +
          '</a>'
        ).join('') +
      '</div>' +
      '<div class="friends-cta-note">🍻 友链位长期开放，欢迎来交换各自的技术角落。</div>';
  }

  /* ═══════════════════════════════════════════
     9. About
     ═══════════════════════════════════════════ */
  function renderAbout() {
    showPage();
    currentView = 'about';
    updateActiveNav('about');
    document.title = '关于 | w1n8';

    contentInner.innerHTML =
      sectionHTML('关于', 'ABOUT — 我现在在学什么，也想把这里写成什么样子') +
      '<div class="about-wrapper">' +
        '<div class="about-banner">' +
          '<div class="about-banner-main">' +
            '<div class="about-banner-avatar">' +
              '<img src="images/tomori.jpg" alt="w1n8">' +
              '<div class="about-banner-ring"></div>' +
            '</div>' +
            '<div class="about-banner-body">' +
              '<span class="about-banner-kicker">ABOUT ME</span>' +
              '<h1 class="about-banner-title">HELLO WORLD, I\'M <span class="about-accent">w1n8</span></h1>' +
              '<p class="about-banner-desc">网络空间安全专业本科生 · 目前主要在学 Web 安全与 CTF · 西安</p>' +
              '<p class="about-banner-bio">喜欢把零散的学习过程整理成能回看的记录。这里会放题解、复现、踩坑笔记，也会保留一些正在思考的问题和阶段性总结。</p>' +
            '</div>' +
          '</div>' +
          '<div class="about-banner-side">' +
            '<div class="about-banner-stats">' +
              '<div class="about-stat"><span class="about-stat-num">Web</span><span class="about-stat-label">主攻方向</span></div>' +
              '<div class="about-stat"><span class="about-stat-num">CTF</span><span class="about-stat-label">持续练习</span></div>' +
              '<div class="about-stat"><span class="about-stat-num">Xi\'an</span><span class="about-stat-label">坐标</span></div>' +
            '</div>' +
            '<div class="about-banner-note">' +
              '<span class="about-banner-note-kicker">NOW</span>' +
              '<p>这段时间会优先整理 Web 题解、补自动化脚本能力，再把能沉淀下来的东西慢慢归档进来。</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="about-grid">' +
          '<div class="about-card about-card--research">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">学习方向</h3>' +
            '<div class="about-research-items">' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9879;</span>' +
                '<span class="about-research-name">Web 安全</span>' +
                '<span class="about-research-desc">从常见漏洞原理到复现分析，先把基本功打稳。</span>' +
              '</div>' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9760;</span>' +
                '<span class="about-research-name">CTF 入门</span>' +
                '<span class="about-research-desc">以 Web / Misc 为主，逐步补足脚本和分析能力。</span>' +
              '</div>' +
              '<div class="about-research-item">' +
                '<span class="about-research-icon">&#9881;</span>' +
                '<span class="about-research-name">工具与习惯</span>' +
                '<span class="about-research-desc">Linux、Python、Burp Suite 和日常工具链持续熟悉中。</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
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
              '<span class="about-tag-pill">HTML/CSS/JS</span>' +
              '<span class="about-tag-pill">Burp Suite</span>' +
              '<span class="about-tag-pill">Nmap</span>' +
              '<span class="about-tag-pill">Wireshark</span>' +
              '<span class="about-tag-pill">SQLMap</span>' +
            '</div>' +
          '</div>' +
          '<div class="about-card about-card--roadmap">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">学习路线</h3>' +
            '<div class="about-roadmap-list">' +
              '<div class="about-roadmap-item done">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Linux 基础与常用命令</span>' +
                  '<span class="about-roadmap-status done-text">已完成</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item done">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Web 安全常见漏洞梳理</span>' +
                  '<span class="about-roadmap-status done-text">已完成</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item active">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">CTF Web / Misc 题型积累</span>' +
                  '<div class="about-progress-bar"><div class="about-progress-fill" style="width:55%"></div></div>' +
                  '<span class="about-roadmap-status">55%</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">Python 自动化脚本整理</span>' +
                  '<span class="about-roadmap-status pending-text">持续推进</span>' +
                '</div>' +
              '</div>' +
              '<div class="about-roadmap-item">' +
                '<span class="about-roadmap-dot"></span>' +
                '<div class="about-roadmap-info">' +
                  '<span class="about-roadmap-name">漏洞复现与长期笔记沉淀</span>' +
                  '<span class="about-roadmap-status pending-text">日常积累</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="about-card about-card--writing">' +
            '<div class="about-card-icon">' +
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            '</div>' +
            '<h3 class="about-card-title">这里会写什么</h3>' +
            '<div class="about-writing-list">' +
              '<div class="about-writing-item">' +
                '<strong>题解与复现</strong>' +
                '<span>优先记录真正做过、能复现、以后还会回看的内容。</span>' +
              '</div>' +
              '<div class="about-writing-item">' +
                '<strong>阶段性笔记</strong>' +
                '<span>把零散学习过程整理成带上下文的记录，而不是只留结论。</span>' +
              '</div>' +
              '<div class="about-writing-item">' +
                '<strong>长期归档</strong>' +
                '<span>希望慢慢把这个博客写成一个可以持续回翻的技术备忘录。</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="about-comments" id="aboutComments">' +
          '<div class="about-comments-header">' +
            '<h3>留言板</h3>' +
            '<p>欢迎交流学习路线、题解思路，或者顺手来交换友链。</p>' +
          '</div>' +
          '<div class="giscus" id="aboutGiscus"></div>' +
        '</div>' +
      '</div>';

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

  hydrateHomePanels();
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
