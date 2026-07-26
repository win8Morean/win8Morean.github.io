(function() {
  var coverEl = document.getElementById('syncCover');
  var titleEl = document.getElementById('syncTitle');
  var authorEl = document.getElementById('syncAuthor');
  var lyricEl = document.getElementById('syncLyricText');
  if (!coverEl || !titleEl || !authorEl) return;

  var lastLyric = '';

  function setLyric(text) {
    if (!lyricEl) return;
    lyricEl.style.opacity = '0';
    setTimeout(function() {
      lyricEl.textContent = text;
      lyricEl.style.opacity = '1';
    }, 300);
  }

  function updateSongInfo(ap) {
    if (!ap || !ap.list || !ap.list.audios) return;
    var idx = ap.list.index;
    var song = ap.list.audios[idx];
    if (!song) return;

    titleEl.textContent = song.name || song.title || 'Unknown';
    authorEl.textContent = song.artist || song.author || 'Unknown';
    if (song.cover) {
      coverEl.src = song.cover;
      coverEl.style.opacity = '1';
    }
  }

  var poll = setInterval(function() {
    var meting = document.querySelector('meting-js');
    if (!meting || !meting.aplayer) return;

    var ap = meting.aplayer;
    clearInterval(poll);

    ap.on('timeupdate', function() {
      var cur = document.querySelector('.aplayer-lrc-current');
      if (!cur) return;
      var txt = (cur.textContent || cur.innerText || '').trim();
      if (txt && txt !== 'Loading' && txt !== lastLyric) {
        lastLyric = txt;
        setLyric(txt);
      }
    });

    ap.on('listswitch', function() {
      updateSongInfo(ap);
      lastLyric = '';
      setLyric('Loading...');
    });

    ap.on('play', function() {
      updateSongInfo(ap);
      setLyric('Enjoy the music...');
    });

    ap.on('pause', function() {
      setLyric('Music paused.');
    });

    updateSongInfo(ap);
  }, 300);

  setTimeout(function() {
    clearInterval(poll);
  }, 15000);
})();
