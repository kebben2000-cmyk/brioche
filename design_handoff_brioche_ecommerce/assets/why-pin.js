/* Brioche — section « Pourquoi Brioche » épinglée : le scroll change la carte affichée (mobile) */
(function () {
  var mq = window.matchMedia('(max-width:768px)');

  function init() {
    var sec = document.querySelector('.why-sec');
    var grid = document.querySelector('.why-grid');
    if (!sec || !grid) return setTimeout(init, 300);
    if (sec.__pinned) return;
    sec.__pinned = true;

    var pairs = [].slice.call(grid.querySelectorAll('.why-pair'));
    if (!pairs.length) return;
    var skip = sec.querySelector('.why-skip') || document.querySelector('.why-skip');

    function setActive(i) {
      pairs.forEach(function (p, n) {
        var on = n === i;
        p.style.opacity = on ? '1' : '0';
        p.style.pointerEvents = on ? 'auto' : 'none';
        p.style.transform = on
          ? 'translateY(-50%) scale(1)'
          : 'translateY(-50%) scale(' + (n < i ? 1.04 : 0.94) + ')';
        p.style.zIndex = on ? 2 : 1;
      });
    }

    function layout() {
      if (!mq.matches) {
        sec.style.minHeight = '';
        pairs.forEach(function (p) { p.style.opacity = ''; p.style.transform = ''; p.style.pointerEvents = ''; });
        return;
      }
      // hauteur de scroll = une "page" par carte
      sec.style.minHeight = (pairs.length * 62 + 12) + 'vh';
      onScroll();
    }

    function onScroll() {
      if (!mq.matches) return;
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      var i = Math.min(pairs.length - 1, Math.floor(p * pairs.length + 0.0001));
      setActive(i);
      if (skip) { var inView = r.top <= 0 && r.bottom > window.innerHeight; skip.style.display = inView ? 'flex' : 'none'; } // skipVisible
    }

    if (skip) {
      skip.addEventListener('click', function (e) {
        e.preventDefault();
        var y = window.scrollY + sec.getBoundingClientRect().bottom - window.innerHeight + 2;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    if (mq.addEventListener) mq.addEventListener('change', layout);
    layout();
    setActive(0);
    if (skip) skip.style.display = mq.matches ? 'flex' : 'none';
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
