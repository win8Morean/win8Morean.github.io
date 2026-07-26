(function() {
  function $(id) {
    return document.getElementById(id);
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function pickGalleryThumbs(photos) {
    var list = Array.isArray(photos) ? photos : [];
    var backgroundThumbs = list.filter(function(photo) {
      return /(?:^|\/)bg\d+\.(?:jpe?g|png|webp)$/i.test(String(photo && photo.src || ''));
    });
    return (backgroundThumbs.length ? backgroundThumbs : list).slice(0, 3);
  }

  function setClick(el, handler) {
    if (el) el.onclick = handler;
  }

  function hydrateHomePanels() {
    if (!$('featuredWriteupTitle')) return;

    var data = window.BLOG_DATA || {};
    var postList = data.postList || [];
    var chatterList = data.chatterList || [];
    var photoAlbum = data.photoAlbum || { title: '', subtitle: '', photos: [] };

    var latestPost = postList[0];
    var secondPost = postList[1];
    var latestChatter = chatterList[0];
    var htbLatest = getLatestArchivePost('all', 'HTB');
    var webLatest = getLatestArchivePost('Web', 'all');
    var eventLatest = getLatestArchivePost('all', 'LitCTF');
    var notesLatest = getLatestArchivePost('Journal', 'all');
    var htbCount = filterArchivePosts('all', 'HTB').length;
    var webCount = filterArchivePosts('Web', 'all').length;
    var eventCount = filterArchivePosts('all', 'LitCTF').length;
    var notesCount = filterArchivePosts('Journal', 'all').length;

    function fillTopicCard(titleEl, metaEl, latestItem, count, fallbackTitle) {
      setText(titleEl, latestItem ? latestItem.title : fallbackTitle);
      setText(metaEl, latestItem
        ? (count + ' 篇 · 最近更新于 ' + getRelativeTimeText(latestItem.date))
        : '这一栏暂时还没有整理好的内容。');
    }

    if (latestPost) {
      setText($('featuredWriteupTitle'), latestPost.title || '未命名文章');
      setText($('featuredWriteupMeta'), getRelativeTimeText(latestPost.date));
      setText($('featuredWriteupDesc'), latestPost.summary || '打开最新的归档文章。');
    } else {
      setText($('featuredWriteupTitle'), '暂无文章');
      setText($('featuredWriteupMeta'), '等待更新');
      setText($('featuredWriteupDesc'), '第一篇文章发布后，这里会自动接住最新内容。');
    }

    setText($('homeStoryPrimaryTitle'), latestPost ? latestPost.title : '从第一篇文章开始');
    setText($('homeStoryPrimaryMeta'), latestPost ? ((latestPost.category || '文章') + ' · ' + getRelativeTimeText(latestPost.date)) : '最新归档入口');
    setText($('homeStorySecondaryTitle'), secondPost ? secondPost.title : '继续在归档里往下看');
    setText($('homeStorySecondaryMeta'), secondPost ? ((secondPost.category || '文章') + ' · ' + getRelativeTimeText(secondPost.date)) : '更多题解和记录');
    setText($('homeStoryTertiaryTitle'), '我现在主要在补 Web 安全和 CTF');
    setText($('homeStoryTertiaryMeta'), '关于 / 路线 / 工具箱');

    fillTopicCard($('homeTopicHTBTitle'), $('homeTopicHTBMeta'), htbLatest, htbCount, 'HTB 相关内容还在整理');
    fillTopicCard($('homeTopicWebTitle'), $('homeTopicWebMeta'), webLatest, webCount, 'Web 题解会集中放在这里');
    fillTopicCard($('homeTopicEventTitle'), $('homeTopicEventMeta'), eventLatest, eventCount, '比赛专题会逐步堆起来');
    fillTopicCard($('homeTopicNotesTitle'), $('homeTopicNotesMeta'), notesLatest, notesCount, '学习笔记会放在这条线');

    setText($('homeAlbumTitle'), photoAlbum.title || '照片墙');
    setText($('homeAlbumMeta'), photoAlbum.photos.length + ' 张 · ' + (photoAlbum.subtitle || '点开相册'));
    if ($('homeGalleryThumbs')) {
      $('homeGalleryThumbs').innerHTML = pickGalleryThumbs(photoAlbum.photos).map(function(photo) {
        return '<img src="' + photo.src + '" alt="" loading="lazy">';
      }).join('');
    }

    setText($('homePostCount'), String(postList.length));
    setText($('homeChatterCount'), String(chatterList.length));
    setText($('homePhotoCount'), String(photoAlbum.photos.length));
    setText($('homeUptime'), getSiteUptimeText());
    setText($('bentoRuntime'), '运行 ' + getSiteUptimeText());

    var latestDates = [];
    if (latestPost && latestPost.date) latestDates.push(latestPost.date);
    if (latestChatter && latestChatter.date) latestDates.push(latestChatter.date);

    if (latestChatter) {
      setText($('featuredChatterTitle'), latestChatter.title || '最新杂谈');
      setText($('featuredChatterMeta'), getRelativeTimeText(latestChatter.date));
      setText($('featuredChatterDesc'), '打开短记录继续看完。');
      setText($('homeCurrentFocus'), latestPost ? ('最近在整理：' + latestPost.title) : 'Web 安全和 CTF');
      setText($('homeCurrentFocusDesc'), '最新杂谈：' + (latestChatter.title || '随手记录'));
    } else {
      setText($('featuredChatterTitle'), '暂无杂谈');
      setText($('featuredChatterMeta'), '等待更新');
      setText($('featuredChatterDesc'), '写下新的短记录后，这里会自动出现入口。');
      setText($('homeCurrentFocus'), latestPost ? ('最近在整理：' + latestPost.title) : 'Web 安全和 CTF');
      setText($('homeCurrentFocusDesc'), '首页优先展示最近整理和长期主线。');
    }

    latestDates.sort(function(a, b) {
      return new Date(b).getTime() - new Date(a).getTime();
    });
    setText($('homeLastUpdate'), latestDates.length ? getRelativeTimeText(latestDates[0]) : '等待同步');

    if ($('homePvInline')) {
      var syncPv = function() {
        var pv = $('busuanzi_value_site_pv');
        if (pv && pv.textContent && pv.textContent !== '--') {
          setText($('homePvInline'), pv.textContent + ' visits');
        }
      };
      syncPv();
      setTimeout(syncPv, 1200);
      setTimeout(syncPv, 4000);
    }

    setClick($('featuredWriteupCard'), function() {
      if (postList.length > 0 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(0);
    });
    setClick($('featuredChatterCard'), function() {
      if (chatterList.length > 0 && typeof window._openChatterArticle === 'function') return window._openChatterArticle(0);
      if (typeof window.renderChatter === 'function') return window.renderChatter();
    });
    setClick($('homeGalleryLink'), function() {
      if (typeof window.renderPhotoAlbum === 'function') window.renderPhotoAlbum();
    });
    setClick($('homeStoryPrimary'), function() {
      if (postList.length > 0 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(0);
    });
    setClick($('homeStorySecondary'), function() {
      if (postList.length > 1 && typeof window._openWriteupArticle === 'function') return window._openWriteupArticle(1);
      if (typeof window.renderArchive === 'function') return window.renderArchive();
    });
    setClick($('homeStoryTertiary'), function() {
      if (typeof window.renderAbout === 'function') return window.renderAbout();
    });
    setClick($('homeTopicHTB'), function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('all', 'HTB');
    });
    setClick($('homeTopicWeb'), function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('Web', 'all');
    });
    setClick($('homeTopicEvent'), function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('all', 'LitCTF');
    });
    setClick($('homeTopicNotes'), function() {
      if (typeof window.openArchivePreset === 'function') return window.openArchivePreset('Journal', 'all');
    });
  }

  window.hydrateHomePanels = hydrateHomePanels;
})();
