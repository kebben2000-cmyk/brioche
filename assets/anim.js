/* Brioche — animations premium partagées (scroll reveals, parallax, count-up, header, hovers) */
(function () {
  if (window.__briocheAnim) return; window.__briocheAnim = true;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- base styles ----
  var st = document.createElement("style");
  st.textContent = [
    "[data-rv]{opacity:0;will-change:transform,opacity;transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}",
    "[data-rv=up]{transform:translateY(34px)}",
    "[data-rv=left]{transform:translateX(-40px)}",
    "[data-rv=right]{transform:translateX(40px)}",
    "[data-rv=scale]{transform:scale(.92)}",
    "[data-rv=clip]{clip-path:inset(0 0 100% 0)}",
    "[data-rv].rv-in{opacity:1;transform:none;clip-path:inset(0 0 0 0)}",
    "[data-rv-stagger]>*{opacity:0;transform:translateY(28px);will-change:transform,opacity;transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}",
    "[data-rv-stagger].rv-in>*{opacity:1;transform:none}",
    ".brioche-header-scrolled{box-shadow:0 6px 24px rgba(20,17,45,.12)}",
    "@media (prefers-reduced-motion:reduce){[data-rv],[data-rv-stagger]>*{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}}"
  ].join("");
  document.head.appendChild(st);

  function onReady(fn){ if (document.readyState !== "loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }

  onReady(function () {
    if (reduce) { document.querySelectorAll("[data-rv]").forEach(function(e){e.classList.add("rv-in");}); document.querySelectorAll("[data-rv-stagger]").forEach(function(e){e.classList.add("rv-in");}); return; }

    // ---- reveal on scroll ----
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var d = parseFloat(el.getAttribute("data-rv-delay") || "0");
        if (el.hasAttribute("data-rv-stagger")) {
          var kids = el.children, i;
          for (i = 0; i < kids.length; i++) kids[i].style.transitionDelay = (i * 90 + d) + "ms";
          el.classList.add("rv-in");
        } else {
          el.style.transitionDelay = d + "ms";
          el.classList.add("rv-in");
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-rv],[data-rv-stagger]").forEach(function (el) { io.observe(el); });

    // ---- count-up (data-count on a text node containing a number) ----
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, raw = el.getAttribute("data-count"), dec = (raw.split(".")[1] || raw.split(",")[1] || "").length;
        var target = parseFloat(raw.replace(",", ".")), suf = el.getAttribute("data-count-suffix") || "", t0 = null;
        function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/1100,1), v=(1-Math.pow(1-p,3))*target; el.textContent=(dec?v.toFixed(dec).replace(".",","):Math.round(v).toLocaleString("fr-FR"))+suf; if(p<1)requestAnimationFrame(step); }
        requestAnimationFrame(step); cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

    // ---- parallax (transform driven by scroll; throttled via rAF) ----
    var pel = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (pel.length) {
      var ticking = false;
      function upd(){
        var vh = window.innerHeight;
        pel.forEach(function (el) {
          var r = el.getBoundingClientRect(), mid = r.top + r.height/2, off = (mid - vh/2)/vh;
          var sp = parseFloat(el.getAttribute("data-parallax") || "0.12");
          el.style.transform = "translate3d(0," + (-off * sp * 100).toFixed(2) + "px,0)";
        });
        ticking = false;
      }
      window.addEventListener("scroll", function(){ if(!ticking){ requestAnimationFrame(upd); ticking = true; } }, { passive: true });
      window.addEventListener("resize", upd, { passive: true }); upd();
    }

    // ---- header shadow on scroll ----
    var hdr = document.querySelector("header");
    if (hdr) {
      var last = -1;
      window.addEventListener("scroll", function(){ var y = window.pageYOffset > 8; if (y !== last){ hdr.classList.toggle("brioche-header-scrolled", y); last = y; } }, { passive: true });
    }
  });
})();
