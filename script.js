/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?   Typewriter Effect
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/
(() => {
  const el = document.getElementById('typewriter');
  const nav = document.getElementById('nav');

  const fullText = (window.BLOG_DATA && window.BLOG_DATA.site && window.BLOG_DATA.site.profile && window.BLOG_DATA.site.profile.name) || 'w1n8';

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

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?   Theme System 鈥?light/dark toggle + localStorage + Giscus sync
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/
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

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?   Post List Data (for Writeups)
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/
const BLOG_DATA = window.BLOG_DATA || {};
const SITE_DATA = BLOG_DATA.site || {};
const SITE_PROFILE = SITE_DATA.profile || {};
if (SITE_DATA.title || SITE_DATA.titleSuffix) {
  document.title = [SITE_DATA.title, SITE_DATA.titleSuffix].filter(Boolean).join(' | ');
}
const navSearchPages = BLOG_DATA.navSearchPages || [];
const postList = BLOG_DATA.postList || [];
const chatterList = BLOG_DATA.chatterList || [];
const photoAlbum = BLOG_DATA.photoAlbum || { title: '', subtitle: '', photos: [] };
const siteStartDate = BLOG_DATA.siteStartDate || '2026-05-12T00:00:00';

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

function normalizeDateString(value) {
  var text = String(value || '').trim();
  var match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return text;
  return match[1] + '-' + String(match[2]).padStart(2, '0') + '-' + String(match[3]).padStart(2, '0');
}

function getDateFromFilename(filePath) {
  var filename = String(filePath || '').split('/').pop();
  var match = filename.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\.md$/);
  if (!match) return '';
  return normalizeDateString(match[1] + '-' + match[2] + '-' + match[3]);
}

function getFirstMeaningfulLine(text) {
  var lines = String(text || '').split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    return line.replace(/^#+\s*/, '').trim();
  }
  return '';
}

function stripFirstMeaningfulLine(text) {
  var lines = String(text || '').split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    return lines.slice(i + 1).join('\n').trim();
  }
  return String(text || '').trim();
}

function parseChatterMeta(md, filePath) {
  var fm = parseFrontmatterBlock(md);
  var content = fm.content || md;
  var title = fm.title || '';
  var date = getDateFromFilename(filePath) || normalizeDateString(fm.date) || '';

  if (!title) {
    var h1 = content.match(/^#\s+(.+)$/m);
    if (h1) title = h1[1].trim();
  }

  if (!title) {
    title = getFirstMeaningfulLine(content);
    if (title) content = stripFirstMeaningfulLine(content);
  }

  return {
    title: title || '无标题杂谈',
    date: date,
    time: fm.time || '',
    tags: fm.tags || [],
    content: content || md
  };
}

function preprocessMarkdown(md) {
  return String(md || '').replace(/!\[\[([^\]]+)\]\]/g, function(match, target) {
    var normalized = String(target || '').split('|')[0].trim();
    if (!normalized) return match;
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(normalized)) {
      var imagePath = normalized.indexOf('/') === -1 ? 'images/' + normalized : normalized;
      return '![](' + imagePath + ')';
    }
    return '\n> 附件：' + normalized + '\n';
  });
}

function renderMarkdown(md) {
  var content = preprocessMarkdown(md);
  return content.trim() ? marked.parse(content) : '';
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

async function buildSearchIndex() {
  var entries = navSearchPages.map(function(item) {
    return {
      type: item.type,
      title: item.title,
      meta: item.meta,
      action: item.action,
      desc: item.desc || '跳转到这个页面，继续按栏目浏览内容。',
      keywords: (item.keywords || []).join(' ')
    };
  });

  postList.forEach(function(post, index) {
    entries.push({
      type: 'post',
      title: post.title || '未命名文章',
      meta: (post.category || 'Article') + ' - ' + (post.date || ''),
      desc: post.summary || ((post.tags || []).slice(0, 3).join(' - ') || '打开文章继续查看完整思路和过程记录。'),
      open: function() { window._openWriteupArticle(index); },
      keywords: [post.title, post.date, post.category, (post.tags || []).join(' '), post.summary, 'article', 'archive', 'writeup'].join(' ')
    });
  });

  chatterList.forEach(function(post) {
    entries.push({
      type: 'chatter',
      title: post.title || '杂谈记录',
      meta: 'Chatter - ' + (post.date || ''),
      desc: '进入短记录正文，继续看完整内容。',
      open: function() { window._openChatterFile(post.path, post.title, post.date); },
      keywords: [post.title, post.date, 'chatter', 'note', 'blog'].join(' ')
    });
  });

  return entries;
}
