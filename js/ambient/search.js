(function() {
  var input = document.getElementById('navSearchInput');
  var dropdown = document.getElementById('navSearchDropdown');
  var mobileFab = document.getElementById('mobileFab');
  if (!input || !dropdown) return;

  var searchIndex = buildSearchIndex();
  var activeResultIndex = -1;
  var clearDropdownTimer = null;

  function buildSearchIndex() {
    var data = window.BLOG_DATA || {};
    var entries = [];

    (data.navSearchPages || []).forEach(function(item) {
      entries.push({
        type: item.type || 'page',
        title: item.title || 'Page',
        meta: item.meta || '',
        action: item.action || '',
        desc: item.desc || '',
        keywords: (item.keywords || []).join(' ')
      });
    });

    (data.postList || []).forEach(function(post, index) {
      entries.push({
        type: 'post',
        title: post.title || 'Untitled post',
        meta: (post.category || 'post') + ' - ' + (post.date || ''),
        desc: post.summary || ((post.tags || []).slice(0, 3).join(' - ') || 'Open the full article to continue reading.'),
        open: function() {
          if (typeof window._openWriteupArticle === 'function') {
            window._openWriteupArticle(index);
          }
        },
        keywords: [post.title, post.date, post.category, (post.tags || []).join(' '), post.summary, 'post', 'archive', 'writeup'].join(' ')
      });
    });

    (data.chatterList || []).forEach(function(post) {
      entries.push({
        type: 'chatter',
        title: post.title || 'Chatter',
        meta: 'chatter - ' + (post.date || ''),
        desc: 'Open the short note and keep reading.',
        open: function() {
          if (typeof window._openChatterFile === 'function') {
            window._openChatterFile(post.path, post.title, post.date);
          }
        },
        keywords: [post.title, post.date, 'chatter', 'note', 'blog'].join(' ')
      });
    });

    return entries;
  }

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
    return safeText.replace(new RegExp('(' + safeQuery + ')', 'ig'), '<mark class="nav-search-highlight">$1</mark>');
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
          '<span class="nav-search-empty-title">No matches found.</span>' +
          '<span class="nav-search-empty-meta">Try another keyword, or jump in from nav and topics.</span>' +
        '</div>';
      dropdown.classList.add('visible');
      return;
    }

    results.slice(0, 6).forEach(function(entry) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-search-result';
      var badge = entry.type === 'page' ? 'PAGE' : (entry.type === 'post' ? 'POST' : (entry.type === 'chatter' ? 'NOTE' : 'ITEM'));
      button.innerHTML =
        '<span class="nav-search-result-top">' +
          '<span class="nav-search-result-badge">' + badge + '</span>' +
          '<span class="nav-search-result-meta">' + escapeHtml(entry.meta || '') + '</span>' +
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
      var buttonsDown = getResultButtons();
      if (!buttonsDown.length) return;
      activeResultIndex = (activeResultIndex + 1 + buttonsDown.length) % buttonsDown.length;
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

  input.addEventListener('blur', function() {
    setTimeout(function() {
      if (window.innerWidth <= 768 && mobileFab) {
        mobileFab.classList.remove('is-hidden');
      }
    }, 120);
  });

  document.addEventListener('keydown', function(e) {
    var isShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if (!isShortcut) return;
    e.preventDefault();
    input.focus();
    input.select();
  });

  document.addEventListener('click', function(e) {
    if (e.target === input || dropdown.contains(e.target)) return;
    closeDropdown();
  });
})();
