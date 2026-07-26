(function() {
  var slider = document.getElementById('global-bg-slider');
  var scene = document.querySelector('.bg-scene');
  if (!slider) return;

  var blogData = window.BLOG_DATA || {};
  var site = blogData.site || {};
  var background = site.background || {};
  var photoAlbum = blogData.photoAlbum || { photos: [] };

  function esc(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function makeDefaultSlides() {
    return [
      { src: 'images/bg1.jpg', title: 'Backdrop 01', note: 'Ambient scene' },
      { src: 'images/bg2.jpg', title: 'Backdrop 02', note: 'Soft focus' },
      { src: 'images/bg3.jpg', title: 'Backdrop 03', note: 'Quiet frame' },
      { src: 'images/bg4.jpg', title: 'Backdrop 04', note: 'Night tone' },
      { src: 'images/bg5.jpg', title: 'Backdrop 05', note: 'Paper light' },
      { src: 'images/bg6.jpg', title: 'Backdrop 06', note: 'Wide depth' }
    ];
  }

  function isBackgroundPhoto(photo) {
    return /(?:^|\/)bg\d+\.(?:jpe?g|png|webp)$/i.test(String(photo && photo.src || ''));
  }

  function resolveSlideTitle(photo, index) {
    if (photo && photo.label) return photo.label;
    return 'Backdrop ' + String(index + 1).padStart(2, '0');
  }

  function resolveSlides() {
    var siteSlides = Array.isArray(background.slides) ? background.slides.slice() : [];
    if (siteSlides.length) {
      return siteSlides.map(function(slide, index) {
        return {
          src: slide.src,
          title: slide.title || resolveSlideTitle(slide, index),
          note: slide.note || background.description || 'Ambient scene'
        };
      }).filter(function(slide) {
        return !!slide.src;
      });
    }

    var albumSlides = (Array.isArray(photoAlbum.photos) ? photoAlbum.photos : [])
      .filter(isBackgroundPhoto)
      .map(function(photo, index) {
        return {
          src: photo.src,
          title: resolveSlideTitle(photo, index),
          note: background.description || 'Ambient scene'
        };
      });

    return albumSlides.length ? albumSlides : makeDefaultSlides();
  }

  var slides = resolveSlides();
  if (!slides.length) return;

  var total = slides.length;
  var activeIndex = 0;
  var currentLayer = 0;
  var layers = [];
  var slideTimer = null;
  var scenePreview = null;
  var sceneTitle = null;
  var sceneDesc = null;
  var sceneIndex = null;
  var sceneProgress = null;
  var sceneStatus = null;
  var playToggleBtn = null;
  var prevBtn = null;
  var nextBtn = null;
  var thumbButtons = [];
  var isPlaying = true;

  function makeSlideLayer(name) {
    var layer = document.createElement('div');
    layer.className = 'bg-slider-layer ' + name;
    return layer;
  }

  function makeSceneCard() {
    if (!scene) return;

    var thumbs = slides.map(function(slide, index) {
      return '' +
        '<button type="button" class="bg-scene-thumb" data-slide-index="' + index + '">' +
          '<span class="bg-scene-thumb-image" style="background-image:url(' + esc(slide.src) + ')"></span>' +
          '<span class="bg-scene-thumb-copy">' +
            '<strong>' + esc(slide.title || ('Backdrop ' + String(index + 1).padStart(2, '0'))) + '</strong>' +
            '<span>' + esc(slide.note || '') + '</span>' +
          '</span>' +
        '</button>';
    }).join('');

    scene.innerHTML = '' +
      '<div class="bg-scene-card">' +
        '<div class="bg-scene-preview" id="bgScenePreview">' +
          '<span class="bg-scene-preview-scrim"></span>' +
          '<div class="bg-scene-preview-copy">' +
            '<span class="bg-scene-kicker">' + esc(background.kicker || 'BACKGROUND REEL') + '</span>' +
            '<strong class="bg-scene-title" id="bgSceneTitle"></strong>' +
            '<p class="bg-scene-desc" id="bgSceneDesc"></p>' +
          '</div>' +
          '<div class="bg-scene-count">' +
            '<span id="bgSceneIndex">01</span>' +
            '<small>/' + String(total).padStart(2, '0') + '</small>' +
          '</div>' +
        '</div>' +
        '<div class="bg-scene-progress"><span id="bgSceneProgress"></span></div>' +
        '<div class="bg-scene-thumbs">' + thumbs + '</div>' +
        '<div class="bg-scene-controls">' +
          '<button type="button" class="bg-scene-control" data-control="prev" aria-label="Previous background">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
          '</button>' +
          '<button type="button" class="bg-scene-control bg-scene-control--primary" data-control="toggle" aria-label="Pause background rotation">' +
            '<svg class="bg-scene-control-icon bg-scene-control-icon--pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>' +
            '<svg class="bg-scene-control-icon bg-scene-control-icon--play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>' +
          '</button>' +
          '<button type="button" class="bg-scene-control" data-control="next" aria-label="Next background">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '</button>' +
          '<span class="bg-scene-status" id="bgSceneStatus">AUTO</span>' +
        '</div>' +
      '</div>';

    scenePreview = document.getElementById('bgScenePreview');
    sceneTitle = document.getElementById('bgSceneTitle');
    sceneDesc = document.getElementById('bgSceneDesc');
    sceneIndex = document.getElementById('bgSceneIndex');
    sceneProgress = document.getElementById('bgSceneProgress');
    sceneStatus = document.getElementById('bgSceneStatus');
    playToggleBtn = scene.querySelector('[data-control="toggle"]');
    prevBtn = scene.querySelector('[data-control="prev"]');
    nextBtn = scene.querySelector('[data-control="next"]');
    thumbButtons = Array.prototype.slice.call(scene.querySelectorAll('.bg-scene-thumb'));

    thumbButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var nextIndex = parseInt(button.dataset.slideIndex, 10);
        if (!isNaN(nextIndex)) goTo(nextIndex, true);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goTo(activeIndex - 1, true);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goTo(activeIndex + 1, true);
      });
    }
    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', function() {
        setPlaying(!isPlaying);
      });
    }
  }

  function ensureLayers() {
    slider.innerHTML = '';
    layers = [makeSlideLayer('bg-slider-layer--primary'), makeSlideLayer('bg-slider-layer--secondary')];
    layers.forEach(function(layer) {
      slider.appendChild(layer);
    });
  }

  function updateScene() {
    var slide = slides[activeIndex] || {};
    var note = slide.note || background.description || '';
    if (scenePreview) {
      scenePreview.style.backgroundImage = 'url(' + slide.src + ')';
    }
    if (sceneTitle) sceneTitle.textContent = slide.title || ('Backdrop ' + String(activeIndex + 1).padStart(2, '0'));
    if (sceneDesc) sceneDesc.textContent = note;
    if (sceneIndex) sceneIndex.textContent = String(activeIndex + 1).padStart(2, '0');
    if (sceneProgress) {
      sceneProgress.style.width = (((activeIndex + 1) / total) * 100) + '%';
    }
    thumbButtons.forEach(function(button, idx) {
      button.classList.toggle('is-active', idx === activeIndex);
    });
  }

  function updateControls() {
    if (sceneStatus) sceneStatus.textContent = isPlaying ? 'AUTO' : 'PAUSED';
    if (playToggleBtn) {
      playToggleBtn.classList.toggle('is-paused', !isPlaying);
      playToggleBtn.setAttribute('aria-label', isPlaying ? 'Pause background rotation' : 'Resume background rotation');
    }
  }

  function clearTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (!isPlaying) return;
    slideTimer = setInterval(function() {
      goTo(activeIndex + 1, false);
    }, 10000);
  }

  function setPlaying(nextPlaying) {
    isPlaying = !!nextPlaying;
    updateControls();
    startTimer();
  }

  function paintLayer(layer, slide, active) {
    if (!layer || !slide) return;
    layer.style.backgroundImage = 'url(' + slide.src + ')';
    layer.classList.toggle('is-active', !!active);
  }

  function goTo(nextIndex, manual) {
    if (!total) return;
    activeIndex = (nextIndex + total) % total;
    var slide = slides[activeIndex];
    var nextLayer = layers[1 - currentLayer];
    var prevLayer = layers[currentLayer];

    paintLayer(nextLayer, slide, false);
    requestAnimationFrame(function() {
      nextLayer.classList.add('is-active');
      prevLayer.classList.remove('is-active');
    });

    currentLayer = 1 - currentLayer;
    updateScene();

    if (manual) startTimer();
  }

  ensureLayers();
  makeSceneCard();
  paintLayer(layers[0], slides[0], true);
  paintLayer(layers[1], slides[1] || slides[0], false);
  updateScene();
  updateControls();
  startTimer();
})();
