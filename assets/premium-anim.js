/* Premium animation layer: scroll reveal, parallax, floating, hover (no layout change) */
(function(){
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (RM) return;
  function run(){
    var root = document.querySelector('x-dc') || document;
    var revealSel = ['#produits h2','#produits p','.brioche-card','#avis h2','#avis span','#avis article','.facilite-content > *'];
    revealSel.forEach(function(s){
      Array.prototype.forEach.call(root.querySelectorAll(s), function(el){
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal','');
      });
    });
    ['#produits','#avis'].forEach(function(sec){
      var c = root.querySelector(sec);
      if (!c) return;
      var items = c.querySelectorAll('.brioche-card,article');
      Array.prototype.forEach.call(items, function(el,i){ el.setAttribute('data-reveal-delay', String((i%3)+1)); });
    });
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
    Array.prototype.forEach.call(root.querySelectorAll('[data-reveal]'), function(el){ io.observe(el); });
    Array.prototype.forEach.call(root.querySelectorAll('.brioche-card'), function(el,i){
      el.classList.add('brioche-hoverable');
      var img = el.querySelector('img');
      if (img){ img.setAttribute('data-float',''); img.style.animationDelay = (i*0.4)+'s'; }
    });
    var wordmark = null;
    var ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY || window.pageYOffset;
        if (wordmark) wordmark.style.transform = 'translate(-50%,-50%) translateY(' + (y*0.06) + 'px)';
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive:true });
  }
  if (document.readyState !== 'loading') setTimeout(run, 300);
  else document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 300); });
})();
