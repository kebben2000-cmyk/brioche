/* Brioche — glisser-maintenir pour faire défiler les carrousels */
(function () {
  function wire() {
    var rails = document.querySelectorAll('.bq-reviews, .bq-social');
    if (!rails.length) return setTimeout(wire, 300);
    rails.forEach(function (rail) {
      if (rail.__drag) return;
      rail.__drag = true;
      var down = false, startX = 0, startLeft = 0, moved = 0, vel = 0, lastX = 0, lastT = 0, raf = null;

      function start(e) {
        down = true; moved = 0; vel = 0;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        startX = lastX = (e.touches ? e.touches[0] : e).pageX;
        lastT = performance.now();
        startLeft = rail.scrollLeft;
        rail.style.cursor = 'grabbing';
        rail.style.scrollSnapType = 'none';
        rail.style.scrollBehavior = 'auto';
      }
      function move(e) {
        if (!down) return;
        var x = (e.touches ? e.touches[0] : e).pageX;
        var dx = x - startX;
        moved = Math.abs(dx);
        var now = performance.now();
        var dt = now - lastT;
        if (dt > 0) { vel = 0.8 * vel + 0.2 * ((x - lastX) / dt) * 16; }
        lastX = x; lastT = now;
        rail.scrollLeft = startLeft - dx;
        if (moved > 6 && e.cancelable && !e.touches) e.preventDefault();
      }
      function end() {
        if (!down) return;
        down = false;
        rail.style.cursor = 'grab';
        var v = vel;
        function glide() {
          if (Math.abs(v) < 0.4) {
            rail.style.scrollBehavior = 'smooth';
            rail.style.scrollSnapType = 'x mandatory';
            raf = null;
            return;
          }
          rail.scrollLeft -= v;
          v *= 0.94;
          raf = requestAnimationFrame(glide);
        }
        if (Math.abs(v) > 0.4) { raf = requestAnimationFrame(glide); }
        else { rail.style.scrollBehavior = 'smooth'; rail.style.scrollSnapType = 'x mandatory'; }
      }

      rail.style.cursor = 'grab';
      rail.addEventListener('mousedown', start);
      rail.addEventListener('touchstart', start, { passive: true });
      window.addEventListener('mousemove', move);
      rail.addEventListener('touchmove', move, { passive: true });
      window.addEventListener('mouseup', end);
      rail.addEventListener('touchend', end);
      rail.addEventListener('mouseleave', end);
      rail.addEventListener('click', function (e) {
        if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    });
  }
  if (document.readyState !== 'loading') wire();
  else document.addEventListener('DOMContentLoaded', wire);
})();
