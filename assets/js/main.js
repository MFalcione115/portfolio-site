(function () {
  var renderBar = document.getElementById('renderBar');
  function updateRenderBar() {
    if (!renderBar) return;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    progress = Math.max(0, Math.min(1, progress));
    renderBar.style.width = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateRenderBar, { passive: true });
  window.addEventListener('resize', updateRenderBar);
  updateRenderBar();
})();

(function () {
  var track = document.getElementById('timelineTrack');
  var playhead = document.getElementById('timelinePlayhead');
  if (!track || !playhead) return;

  var clips = Array.prototype.slice.call(track.querySelectorAll('.timeline-clip'));
  var sections = clips
    .map(function (clip) {
      var id = clip.getAttribute('data-target');
      return document.getElementById(id);
    })
    .filter(Boolean);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(id) {
    clips.forEach(function (clip) {
      clip.classList.toggle('is-active', clip.getAttribute('data-target') === id);
    });
  }

  function updatePlayhead() {
    var trackWidth = track.clientWidth;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    progress = Math.max(0, Math.min(1, progress));
    playhead.style.left = (progress * trackWidth) + 'px';
  }

  function updateActiveSection() {
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) current = section;
    });
    if (current) setActive(current.id);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updatePlayhead();
      updateActiveSection();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (reduceMotion) {
    playhead.style.transition = 'none';
  }

  var track2Toggle = document.getElementById('track2Toggle');
  var track2Panel = document.getElementById('track2Panel');
  if (track2Toggle && track2Panel) {
    track2Toggle.addEventListener('click', function () {
      var isOpen = track2Panel.classList.toggle('is-open');
      track2Toggle.classList.toggle('is-open', isOpen);
      track2Toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var track2Track = document.getElementById('track2Track');
  var track2Playhead = document.getElementById('track2Playhead');
  if (track2Track && track2Playhead) {
    track2Track.addEventListener('mousemove', function (e) {
      var rect = track2Track.getBoundingClientRect();
      var x = e.clientX - rect.left;
      track2Playhead.style.left = x + 'px';
      track2Playhead.classList.add('is-visible');
    });
    track2Track.addEventListener('mouseleave', function () {
      track2Playhead.classList.remove('is-visible');
    });
  }
})();

/* LIGHTBOX — click any gallery/work media to expand it full-screen
   instead of opening a new tab. Handles local images, local videos,
   and YouTube links (Work section cards). */
(function () {
  var lightbox = document.getElementById('lightbox');
  var content = document.getElementById('lightboxContent');
  var closeBtn = document.getElementById('lightboxClose');
  if (!lightbox || !content) return;

  function youTubeEmbedUrl(url) {
    var match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    return match ? 'https://www.youtube.com/embed/' + match[1] + '?autoplay=1' : null;
  }

  function openLightbox(triggerEl) {
    content.innerHTML = '';
    var innerVideo = triggerEl.querySelector('video');
    var innerImg = triggerEl.querySelector('img');
    var href = triggerEl.getAttribute('href') || '';

    if (innerVideo) {
      var video = document.createElement('video');
      video.src = innerVideo.currentSrc || innerVideo.src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      content.appendChild(video);
    } else if (/youtu\.?be/.test(href)) {
      var embedUrl = youTubeEmbedUrl(href);
      if (!embedUrl) return;
      var iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      content.appendChild(iframe);
    } else if (innerImg) {
      var img = document.createElement('img');
      img.src = href || innerImg.src;
      img.alt = innerImg.alt || '';
      content.appendChild(img);
    } else {
      return;
    }

    lightbox.classList.add('is-open');
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('hidden', '');
    content.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item, .work-card').forEach(function (el) {
    if (el.tagName !== 'A') return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(el);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* PAUSE OFF-SCREEN — autoplay gallery videos pause when scrolled out of
   view, saving bandwidth/battery, and resume when scrolled back into view. */
(function () {
  var videos = document.querySelectorAll('.gallery-item video');
  if (!videos.length || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });
  videos.forEach(function (v) { observer.observe(v); });
})();
