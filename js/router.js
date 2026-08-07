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
  let currentArticleRoute = '';
  let suppressRouteClear = false;

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

  /* ── Twikoo loader (deduped) ── */
  var _aboutCommentTimer = null;
  var _twikooScriptPromise = null;
  var _articleScrollHandler = null;

  function ensureTwikooScript() {
    if (window.twikoo) return Promise.resolve(window.twikoo);
    if (_twikooScriptPromise) return _twikooScriptPromise;
    _twikooScriptPromise = new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.staticfile.net/twikoo/1.6.41/twikoo.all.min.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = function() { resolve(window.twikoo); };
      script.onerror = function() {
        if (!script.dataset.fallbackUsed) {
          script.dataset.fallbackUsed = '1';
          var fallbackScript = document.createElement('script');
          fallbackScript.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js';
          fallbackScript.async = true;
          fallbackScript.crossOrigin = 'anonymous';
          fallbackScript.onload = function() { resolve(window.twikoo); };
          fallbackScript.onerror = function() {
            _twikooScriptPromise = null;
            reject(new Error('Twikoo script load failed'));
          };
          document.head.appendChild(fallbackScript);
          return;
        }
        _twikooScriptPromise = null;
        reject(new Error('Twikoo script load failed'));
      };
      document.head.appendChild(script);
    });
    return _twikooScriptPromise;
  }

  function renderCommentPlaceholder(container, message) {
    container.innerHTML = '<div class="comment-placeholder">' + escapeHtmlText(message || '评论加载失败') + '</div>';
  }

  function loadTwikoo(container, path) {
    if (!container) return;
    if (!container.id) {
      container.id = 'twikoo-' + Math.random().toString(36).slice(2, 10);
    }
    var selector = '#' + container.id;
    var envId = window.BLOG_DATA && window.BLOG_DATA.twikoo && window.BLOG_DATA.twikoo.envId ? window.BLOG_DATA.twikoo.envId : '';
    if (!envId) {
      renderCommentPlaceholder(container, 'Twikoo envId 未配置');
      return;
    }
    container.innerHTML = '<div class="comment-placeholder">加载评论中...</div>';
    ensureTwikooScript().then(function() {
      container.innerHTML = '';
      if (!window.twikoo || typeof window.twikoo.init !== 'function') {
        renderCommentPlaceholder(container, '评论组件不可用');
        return;
      }
      window.twikoo.init({
        envId: envId,
        el: selector,
        path: path
      });
    }).catch(function() {
      renderCommentPlaceholder(container, '评论加载失败');
    });
  }

  function normalizeArticleKey(value) {
    return String(value || '')
      .replace(/\\/g, '/')
      .replace(/^\.?\//, '')
      .replace(/\.md$/i, '');
  }

  function getArticleKey(source, post, index) {
    var raw = source === 'chatter'
      ? (post.path || post.filename || post.title || ('item-' + index))
      : (post.filename || post.path || post.title || ('item-' + index));
    raw = normalizeArticleKey(raw);
    if (source === 'writeups' && raw.indexOf('posts/') === 0) {
      raw = raw.slice(6);
    }
    if (source === 'chatter' && raw.indexOf('chatters/') === 0) {
      raw = raw.slice(9);
    }
    return raw || (source + '-' + index);
  }

  function buildArticleRoute(source, post, index) {
    return '#/' + source + '/' + encodeURIComponent(getArticleKey(source, post, index));
  }

  function parseArticleRoute() {
    var hash = window.location.hash || '';
    if (!hash) return null;
    var route = hash.replace(/^#\/?/, '');
    if (!route) return null;
    var parts = route.split('/');
    if (parts.length < 2) return null;
    var source = parts[0];
    if (source !== 'writeups' && source !== 'chatter') return null;
    var encodedKey = parts.slice(1).join('/');
    var key = encodedKey;
    try {
      key = decodeURIComponent(encodedKey);
    } catch (e) {}
    return { source: source, key: key };
  }

  function findArticleIndexByKey(source, key) {
    var list = source === 'chatter' ? chatterList : postList;
    return list.findIndex(function(post, index) {
      return getArticleKey(source, post, index) === key;
    });
  }

  function syncArticleRoute(source, post, index, replace) {
    var route = buildArticleRoute(source, post, index);
    currentArticleRoute = route;
    if (window.location.hash === route) return;
    if (replace && window.history && history.replaceState) {
      history.replaceState(null, '', route);
      return;
    }
    window.location.hash = route;
  }

  function clearArticleRoute() {
    currentArticleRoute = '';
    if (!window.location.hash) return;
    if (window.history && history.replaceState) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
  }

  function openRouteArticle(source, index, replace) {
    suppressRouteClear = true;
    if (source === 'writeups') {
      renderArchive();
    } else if (source === 'chatter') {
      renderChatter();
    }
    suppressRouteClear = false;
    openArticle(index, source, { syncRoute: false, replaceRoute: replace });
  }

  /* ── View Transitions ── */
  function showHome() {
    var hadArticle = articleOverlay.classList.contains('visible');
    homeView.classList.remove('hidden');
    contentView.classList.remove('visible');
    articleOverlay.classList.remove('visible');
    currentView = 'home';
    updateActiveNav('home');
    document.title = 'w1n8 | Web Security';
    if (hadArticle && !suppressRouteClear) {
      clearArticleRoute();
    }
  }

  function showPage() {
    var hadArticle = articleOverlay.classList.contains('visible');
    homeView.classList.add('hidden');
    articleOverlay.classList.remove('visible');
    contentView.classList.add('visible');
    contentView.scrollTop = 0;
    document.body.classList.remove('route-about');
    // Cancel any pending About comment timer
    if (_aboutCommentTimer) { clearTimeout(_aboutCommentTimer); _aboutCommentTimer = null; }
    if (hadArticle && !suppressRouteClear) {
      clearArticleRoute();
    }
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
    // Clear article comments when leaving the reader
    var ab = document.getElementById('articleBody');
    if (ab) {
      var commentBox = ab.querySelector('.comment-thread');
      if (commentBox) commentBox.innerHTML = '';
    }
    clearArticleRoute();
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
     3. Writeups (Archives) — uses .md loading + comments
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
    var tagCounts = {};
    categoryPosts.forEach(function(post) {
      (post.tags || []).forEach(function(tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    var visibleTags = availableTags.slice().sort(function(a, b) {
      var diff = (tagCounts[b] || 0) - (tagCounts[a] || 0);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    }).slice(0, 6);
    if (archiveFilterState.tag !== 'all' && visibleTags.indexOf(archiveFilterState.tag) === -1) {
      visibleTags.unshift(archiveFilterState.tag);
    }
    visibleTags = visibleTags.filter(function(tag, idx, arr) {
      return arr.indexOf(tag) === idx;
    });

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
                  '<button class="archive-pill' + (archiveFilterState.category === 'all' ? ' active' : '') + '" type="button" data-filter-kind="category" data-filter-value="all">全部</button>' +
                  categories.map(function(category) {
                    return '<button class="archive-pill' + (archiveFilterState.category === category ? ' active' : '') + '" type="button" data-filter-kind="category" data-filter-value="' + escapeHtmlText(category) + '">' + category + '</button>';
                  }).join('') +
                '</div>' +
              '</div>' +
              '<div class="archive-filter-group">' +
                '<span class="archive-filter-label">标签</span>' +
                '<div class="archive-filters archive-filters--tags">' +
                  '<button class="archive-pill' + (archiveFilterState.tag === 'all' ? ' active' : '') + '" type="button" data-filter-kind="tag" data-filter-value="all">全部</button>' +
                  visibleTags.map(function(tag) {
                    return '<button class="archive-pill' + (archiveFilterState.tag === tag ? ' active' : '') + '" type="button" data-filter-kind="tag" data-filter-value="' + escapeHtmlText(tag) + '">#' + tag + '</button>';
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
                  (post.tags || []).slice(0, 2).map(function(tag) {
                    return '<span class="archive-entry-badge">#' + tag + '</span>';
                  }).join('');
                return '' +
                  '<button class="archive-entry" type="button" data-post-index="' + post._index + '">' +
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
    contentInner.querySelectorAll('.archive-pill[data-filter-kind]').forEach(function(button) {
      button.addEventListener('click', function() {
        var kind = button.dataset.filterKind;
        var value = button.dataset.filterValue || 'all';
        if (kind === 'category') {
          window.setArchiveCategoryFilter(value);
        } else if (kind === 'tag') {
          window.setArchiveTagFilter(value);
        }
      });
    });
    contentInner.querySelectorAll('.archive-entry[data-post-index]').forEach(function(button) {
      button.addEventListener('click', function() {
        var idx = parseInt(button.dataset.postIndex, 10);
        if (!isNaN(idx)) window._openWriteupArticle(idx);
      });
    });
  }

  /* ── Article Reader (shared by Writeups & Chatter) ── */
  async function openArticle(index, source, options) {
    options = options || {};
    const isChatter = source === 'chatter';
    const post = isChatter ? chatterList[index] : postList[index];
    const basePath = isChatter ? 'chatters/' : 'posts/';
    const filename = isChatter
      ? (post.path ? post.path.split('/').pop() : post.filename)
      : post.filename;
    const articleKey = getArticleKey(source, post, index);
    const route = buildArticleRoute(source, post, index);
    const sectionName = isChatter ? '云端杂谈' : '归档文章';

    articlePath.textContent = '~/' + source + '/' + filename;
    articleBody.innerHTML = '<div class="article-loading">Loading ' + filename + ' ...</div>';
    currentWriteupIndex = index;
    currentArticleRoute = route;
    showArticle();

    if (options.syncRoute !== false) {
      syncArticleRoute(source, post, index, !!options.replaceRoute);
    }

    function getMergedChapterTitle(sourceFile, chapterIndex) {
      var name = String(sourceFile || '').split('/').pop().replace(/\.md$/i, '');
      if (/web/i.test(name)) return (chapterIndex + 1) + '. Web 题解';
      if (/misc/i.test(name)) return (chapterIndex + 1) + '. Misc 题解';
      if (/crypto/i.test(name)) return (chapterIndex + 1) + '. Crypto 题解';
      return (chapterIndex + 1) + '. ' + (getFirstMeaningfulLine(name) || '章节');
    }

    try {
      const sourceFiles = !isChatter && Array.isArray(post.sources) && post.sources.length
        ? post.sources
        : [filename];
      const mdParts = await Promise.all(sourceFiles.map(async function(sourceFile) {
        const res = await fetch(isChatter && post.path ? post.path : (basePath + sourceFile));
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        return await res.text();
      }));
      const isMergedWriteup = !isChatter && Array.isArray(post.sources) && post.sources.length > 1;
      const md = mdParts.join('\n\n---\n\n');
      const fm = isChatter ? parseChatterMeta(md, post.path || filename) : parseFrontmatterBlock(md);
      const articleTitle = fm.title || post.title || '未命名文章';
      const articleDate = fm.date || post.date || '--';
      const articleTags = mergeTags(post.tags, fm.tags);
      const articleContent = fm.content || md;
      document.title = articleTitle + ' | w1n8';
      const articleText = stripMarkdown(articleContent);
      const articleHtml = renderMarkdown(articleContent);
      let articleOutline = [];
      let articleProseHtml = '';
      if (isMergedWriteup) {
        articleProseHtml = mdParts.map(function(partMd, partIndex) {
          const chapterId = 'article-chapter-' + partIndex;
          const chapterTitle = getMergedChapterTitle(sourceFiles[partIndex], partIndex);
          const renderedPart = renderMarkdown(partMd);
          const partDoc = new DOMParser().parseFromString('<div class="article-prose-root">' + renderedPart + '</div>', 'text/html');
          const headingNodes = Array.from(partDoc.querySelectorAll('h2, h3, h4'));

          articleOutline.push({
            id: chapterId,
            text: chapterTitle,
            level: 'h2'
          });

          headingNodes.forEach(function(heading, headingIndex) {
            var text = (heading.textContent || '').trim();
            var id = chapterId + '-heading-' + headingIndex + '-' + slugifyHeading(text || ('section-' + headingIndex));
            heading.id = id;
            articleOutline.push({
              id: id,
              text: text,
              level: heading.tagName.toLowerCase() === 'h2' ? 'h3' : 'h4'
            });
          });

          return '' +
            '<section class="article-chapter" id="' + chapterId + '">' +
              partDoc.querySelector('.article-prose-root').innerHTML +
            '</section>';
        }).join('');
      } else {
        const articleDoc = new DOMParser().parseFromString('<div class="article-prose-root">' + articleHtml + '</div>', 'text/html');
        const headingNodes = Array.from(articleDoc.querySelectorAll('h2, h3'));
        articleOutline = headingNodes.map(function(heading, headingIndex) {
          var text = (heading.textContent || '').trim();
          var id = 'article-heading-' + headingIndex + '-' + slugifyHeading(text || ('section-' + headingIndex));
          heading.id = id;
          return {
            id: id,
            text: text,
            level: heading.tagName.toLowerCase()
          };
        });
        articleProseHtml = articleDoc.querySelector('.article-prose-root').innerHTML;
      }
      const readingMinutes = estimateReadingMinutes(articleText);
      const categoryLabel = isChatter ? 'Chatter' : (post.category || 'Article');
      const adjacent = getAdjacentContent(index, source);
      const related = getRelatedContent(Object.assign({}, post, { tags: articleTags }), index, source);
      const articleBadges = [
        '<span class="article-meta-badge article-meta-badge--category">' + escapeHtmlText(categoryLabel) + '</span>'
      ].concat(articleTags.slice(0, 3).map(function(tag) {
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
        (item.tags || []).slice(0, 1).forEach(function(tag) {
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
            '<span>' + escapeHtmlText(articleKey) + '</span>' +
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

      /* Twikoo comment system */
      const commentWrap = document.createElement('div');
      commentWrap.className = 'comment-thread-container';

      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment-thread';
      commentDiv.id = 'tcomment';
      commentWrap.appendChild(commentDiv);

      articleDiv.appendChild(commentWrap);
      articleBody.innerHTML = '';
      articleBody.appendChild(articleDiv);
      loadTwikoo(commentDiv, source + '/' + articleKey);
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
  window.renderArchive = renderArchive;
  window.renderChatter = renderChatter;
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
     6. Chatter (杂谈) — .md loading + comments
     ═══════════════════════════════════════════ */
  function renderChatter() {
    showPage();
    currentView = 'chatter';
    updateActiveNav('chatter');
    document.title = '杂谈 | w1n8';

    let html = sectionHTML('杂谈', 'CHATTER — 共 ' + chatterList.length + ' 篇短记录');

    if (chatterList.length === 0) {
      html += '<div class="post-list-empty">还没有文章，敬请期待。</div>';
    } else {
      html +=
        '<div class="chatter-timeline">' +
          chatterList.map(function(post, index) {
            return '' +
              '<button class="chatter-timeline-item' + (index === 0 ? ' chatter-timeline-item--featured' : '') + '" type="button" data-chatter-index="' + index + '">' +
                '<div class="chatter-timeline-marker">' +
                  '<span class="chatter-timeline-dot"></span>' +
                '</div>' +
                '<div class="chatter-timeline-card">' +
                  '<div class="chatter-timeline-head">' +
                    '<span class="chatter-timeline-date">' + (post.date || '--') + '</span>' +
                    '<span class="chatter-timeline-badge">NOTE</span>' +
                  '</div>' +
                  '<h3 class="chatter-timeline-title">' + post.title + '</h3>' +
                  '<p class="chatter-timeline-desc">一些不适合写成长文、但值得单独记下来的片段。</p>' +
                  '<div class="chatter-timeline-foot">' +
                    '<span class="chatter-timeline-cta">展开记录</span>' +
                    '<span class="chatter-timeline-arrow">→</span>' +
                  '</div>' +
                '</div>' +
              '</button>';
          }).join('') +
        '</div>';
    }

    contentInner.innerHTML = html;
    contentInner.querySelectorAll('.chatter-timeline-item[data-chatter-index]').forEach(function(button) {
      button.addEventListener('click', function() {
        var idx = parseInt(button.dataset.chatterIndex, 10);
        if (!isNaN(idx)) window._openChatterArticle(idx);
      });
    });
  }

  window._openChatterArticle = function(index) {
    openArticle(index, 'chatter');
  };
  window._openChatterFile = function(path, title, date) {
    var idx = chatterList.findIndex(function(item) { return item.path === path; });
    if (idx >= 0) return openArticle(idx, 'chatter');
  };

  function syncArticleRouteFromHash() {
    var route = parseArticleRoute();
    if (!route) {
      if (articleOverlay.classList.contains('visible')) {
        hideArticle();
      }
      currentArticleRoute = '';
      return false;
    }

    if (window.location.hash === currentArticleRoute && articleOverlay.classList.contains('visible')) {
      return true;
    }

    var index = findArticleIndexByKey(route.source, route.key);
    if (index < 0) {
      clearArticleRoute();
      return false;
    }

    openRouteArticle(route.source, index, true);
    return true;
  }

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
      sectionHTML('关于', 'ABOUT — 我现在在学什么，也想把这里写成什么样子').replace('section-header', 'section-header section-header--about') +
      '<div class="about-wrapper">' +
      '<div class="about-banner glass-panel">' +
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
        '<div class="status-card">' +
          '<div class="status-indicator"></div>' +
          '<div class="status-text">[Live Status] 状态：正在学习Web 代码审计...</div>' +
        '</div>' +

        '<div class="about-grid">' +
          '<div class="about-card about-card--research glass-panel">' +
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
          '<div class="about-card about-card--arsenal glass-panel">' +
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
          '<div class="about-card about-card--roadmap terminal-card glass-panel">' +
            '<div class="terminal-header">' +
              '<span class="mac-dot red"></span><span class="mac-dot yellow"></span><span class="mac-dot green"></span>' +
            '</div>' +
            '<div class="terminal-body">' +
              '<div class="term-line">w1n8@cyber-sec:~$ ./show_new_roadmap.sh</div>' +
              '<div class="term-line">&gt; [██████████░░] Web/Misc 基础夯实 80%</div>' +
              '<div class="term-line">&gt; [██████░░░░░░] 信息安全竞赛作品开发 50%</div>' +
              '<div class="term-line">&gt; [██░░░░░░░░░░] 自动化渗透工具编写 20%</div>' +
              '<div class="term-line cursor-blink">_</div>' +
            '</div>' +
          '</div>' +
          '<div class="about-card about-card--writing glass-panel">' +
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
          '<div class="about-card github-card glass-panel">' +
            '<div class="card-title"><span class="icon">🐙</span> GitHub Contributions</div>' +
            '<img class="gh-chart" src="https://ghchart.rshah.org/w1n8" alt="w1n8\'s GitHub Chart" />' +
          '</div>' +
        '</div>' +
        '<div class="about-comments glass-panel" id="aboutComments">' +
          '<div class="about-comments-header">' +
            '<h3>留言板</h3>' +
            '<p>欢迎交流学习路线、题解思路，或者顺手来交换友链。</p>' +
          '</div>' +
          '<div class="comment-thread" id="aboutTwikoo"></div>' +
        '</div>' +
      '</div>';

    /* ── Load Twikoo ── */
    if (_aboutCommentTimer) clearTimeout(_aboutCommentTimer);
    _aboutCommentTimer = setTimeout(function() {
      loadTwikoo(document.getElementById('aboutTwikoo'), 'about');
    }, 200);

    var ghChart = contentInner.querySelector('.gh-chart');
    if (ghChart) {
      ghChart.addEventListener('error', function() {
        if (ghChart.dataset.fallbackShown === '1') return;
        ghChart.dataset.fallbackShown = '1';
        ghChart.style.display = 'none';
        var fallback = document.createElement('div');
        fallback.className = 'gh-chart-fallback';
        fallback.textContent = 'GitHub contributions chart unavailable.';
        ghChart.insertAdjacentElement('afterend', fallback);
      }, { once: true });
    }
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
  window.addEventListener('hashchange', syncArticleRouteFromHash);
  if (!syncArticleRouteFromHash()) {
    renderHome();
  }
})();
