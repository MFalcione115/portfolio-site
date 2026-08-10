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
})();
