/* Brioche — deck de produits façon swipe (mobile) */
(function () {
  function init() {
    var deck = document.querySelector('[data-swipe-deck]');
    if (!deck) { return setTimeout(init, 300); }
    if (deck.__wired) return;
    deck.__wired = true;

    var cards = [].slice.call(deck.querySelectorAll('[data-swipe-card]'));
    var counter = deck.querySelector('[data-swipe-count]');
    var total = cards.length;
    var idx = 0;

    function layout() {
      cards.forEach(function (c, i) {
        var d = i - idx;
        c.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1),opacity .32s ease';
        if (d < 0) {
          c.style.transform = 'translate(-130%,0) rotate(-16deg)';
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
          c.style.zIndex = 1;
        } else if (d > 3) {
          c.style.transform = 'translateX(48px) scale(.86)';
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
          c.style.zIndex = 1;
        } else {
          c.style.transform = 'translateX(' + (d % 2 ? 1 : -1) * (d * 26) + 'px) rotate(' + ((d % 2 ? 1 : -1) * d * 4) + 'deg) scale(' + (1 - d * 0.07) + ')';
          c.style.opacity = '1';
          c.style.pointerEvents = d === 0 ? 'auto' : 'none';
          c.style.zIndex = 10 - d;
        }
        var yes = c.querySelector('[data-stamp="yes"]');
        var no = c.querySelector('[data-stamp="no"]');
        if (yes) yes.style.opacity = '0';
        if (no) no.style.opacity = '0';
      });
      if (counter) counter.textContent = Math.min(idx + 1, total) + ' / ' + total;
    }

    function advance() {
      idx = (idx + 1) % total;
      if (idx === 0) { cards.forEach(function (c) { c.style.transition = 'none'; }); }
      layout();
    }

    function fling(dir) {
      var c = cards[idx];
      if (!c) return;
      var stamp = c.querySelector(dir > 0 ? '[data-stamp="yes"]' : '[data-stamp="no"]');
      if (stamp) stamp.style.opacity = '1';
      c.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1),opacity .3s ease';
      c.style.transform = 'translate(' + (dir * 130) + '%,-20px) rotate(' + (dir * 16) + 'deg)';
      c.style.opacity = '0';
      setTimeout(advance, 300);
    }

    /* drag */
    var startX = 0, startY = 0, dragging = false, cur = null;
    function down(e) {
      cur = cards[idx];
      if (!cur || !cur.contains(e.target)) return;
      if (e.target.closest('[data-swipe-btn]')) return;
      if (e.target.closest('a')) return;
      dragging = true;
      var p = e.touches ? e.touches[0] : e;
      startX = p.clientX; startY = p.clientY;
      cur.style.transition = 'none';
    }
    function move(e) {
      if (!dragging || !cur) return;
      if (!deck.contains(e.target)) return;
      var p = e.touches ? e.touches[0] : e;
      var dx = p.clientX - startX, dy = p.clientY - startY;
      if (Math.abs(dx) < Math.abs(dy)) return;
      if (e.cancelable) e.preventDefault();
      cur.style.transform = 'translate(' + dx + 'px,' + (dy * 0.25) + 'px) rotate(' + (dx / 18) + 'deg)';
      var yes = cur.querySelector('[data-stamp="yes"]');
      var no = cur.querySelector('[data-stamp="no"]');
      if (yes) yes.style.opacity = dx > 20 ? Math.min(1, dx / 110) : 0;
      if (no) no.style.opacity = dx < -20 ? Math.min(1, -dx / 110) : 0;
    }
    function up(e) {
      if (!dragging || !cur) return;
      dragging = false;
      var p = e.changedTouches ? e.changedTouches[0] : e;
      var dx = p.clientX - startX;
      if (Math.abs(dx) > 90) { fling(dx > 0 ? 1 : -1); }
      else { layout(); }
    }

    deck.addEventListener('mousedown', down);
    deck.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);

    deck.addEventListener('click', function (e) {
      var b = e.target.closest('[data-swipe-btn]');
      if (!b) return;
      e.preventDefault();
      var act = b.getAttribute('data-swipe-btn');
      if (act === 'pass') { fling(-1); return; }
      if (act === 'like' || act === 'cart') {
        var c = cards[idx];
        if (c && window.BriocheCart) {
          window.BriocheCart.add({
            id: c.dataset.id, name: c.dataset.name, variant: c.dataset.variant || '',
            price: parseFloat(c.dataset.price) || 0, img: c.dataset.img, qty: 1
          });
        }
        return;
      }
    });

    layout();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
