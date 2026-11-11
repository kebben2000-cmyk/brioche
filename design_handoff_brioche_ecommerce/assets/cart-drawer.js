/* Brioche — panier partagé (drawer + checkout), persistant via localStorage */
(function () {
  if (window.__briocheCartInit) return;
  window.__briocheCartInit = true;
  const KEY = "brioche-cart-v1";
  const C = { ink:"#26224f", primary:"#0E2180", cream:"#f0e7cf", bg:"#fffdf9", panel:"#f3efe1", muted:"#8983b0", line:"rgba(14,33,128,.14)" };
  let step = "cart"; // cart | livraison | paiement | confirmation
  let mounted = false;

  const FREE_SHIP = 50;
  const CATALOG = [
    { id:"laisse-led", name:"Laisse LED Rétractable", variant:"Blanc", price:49.40, img:"./assets/card-ledring.png", href:"Fiche Produit LED.dc.html" },
    { id:"gourde", name:"Gourde Balade", variant:"Beige", price:20, img:"./assets/card-gourde.png", href:"Fiche Produit Gourde.dc.html" },
    { id:"boule", name:"Boule de léchage", variant:"Violet · M", price:15, img:"./assets/card-boule.png", href:"Fiche Produit Boule.dc.html" },
    { id:"framboise", name:"Laisse Main Libre", variant:"Rose", price:35, img:"./assets/card-laisse.png", href:"Fiche Produit.dc.html" }
  ];
  function crossSell(){ const ids = read().map(i=>i.id); return CATALOG.filter(p=>ids.indexOf(p.id)===-1).slice(0,2); }

  function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); syncBadges(); if (mounted) renderBody(); }
  function count(){ return read().reduce((n,i)=>n+i.qty,0); }
  function subtotal(){ return read().reduce((s,i)=>s+i.price*i.qty,0); }
  function euro(n){ return (Math.round(n*100)/100).toString().replace(/\.0+$/,"").replace(".",",") + " €"; }

  function syncBadges(){
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach(el=>{
      el.textContent = n; el.style.display = n>0 ? "flex" : "none";
    });
  }

  const api = {
    add(item){
      const items = read();
      const f = items.find(i=>i.id===item.id && i.variant===item.variant);
      if (f) f.qty += (item.qty||1); else items.push(Object.assign({qty:1}, item));
      step = "cart"; write(items); open();
    },
    setQty(i,q){ const items=read(); if(items[i]){ items[i].qty=Math.max(1,q); write(items);} },
    remove(i){ const items=read(); items.splice(i,1); write(items); },
    clear(){ write([]); },
    open, close,
    get items(){ return read(); }
  };
  window.BriocheCart = api;

  let root, overlay, drawer, body;

  function ensure(){
    if (mounted) return;
    mounted = true;
    const style = document.createElement("style");
    style.textContent = `
      .bc-ov{position:fixed;inset:0;background:rgba(20,17,45,.42);opacity:0;pointer-events:none;transition:opacity .35s ease;z-index:9998}
      .bc-ov.on{opacity:1;pointer-events:auto}
      .bc-dr{position:fixed;top:0;right:0;height:100%;width:min(440px,100vw);background:${C.bg};box-shadow:-18px 0 50px rgba(20,17,45,.24);
        transform:translateX(100%);transition:transform .42s cubic-bezier(.22,1,.36,1);z-index:9999;display:flex;flex-direction:column;
        font-family:'Work Sans',system-ui,sans-serif;color:${C.ink}}
      .bc-dr.on{transform:none}
      .bc-hd{display:flex;align-items:center;justify-content:space-between;padding:22px 24px;border-bottom:1px solid ${C.line};flex:0 0 auto}
      .bc-ttl{font-family:'ruddy','Archivo Black',sans-serif;font-weight:700;text-transform:uppercase;color:${C.primary};font-size:24px;letter-spacing:-.01em;margin:0}
      .bc-x{width:38px;height:38px;border:none;border-radius:999px;background:transparent;color:${C.primary};font-size:24px;cursor:pointer;transition:background .15s}
      .bc-x:hover{background:rgba(14,33,128,.08)}
      .bc-body{flex:1 1 auto;overflow-y:auto;padding:18px 24px}
      .bc-foot{flex:0 0 auto;border-top:1px solid ${C.line};padding:20px 24px;background:${C.bg}}
      .bc-row{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid ${C.line}}
      .bc-th{width:78px;height:78px;flex:0 0 auto;border-radius:12px;background:${C.panel};overflow:hidden}
      .bc-th img{width:100%;height:100%;object-fit:cover}
      .bc-nm{font-weight:600;font-size:16px;margin:0 0 2px}
      .bc-vr{font-size:12.5px;color:${C.muted};margin:0 0 8px}
      .bc-qt{display:inline-flex;align-items:center;gap:2px;border:1px solid ${C.line};border-radius:999px;padding:3px 5px}
      .bc-qt button{width:28px;height:28px;border:none;border-radius:999px;background:transparent;color:${C.primary};font-size:17px;cursor:pointer;transition:background .15s}
      .bc-qt button:hover{background:rgba(14,33,128,.08)}
      .bc-qt span{min-width:26px;text-align:center;font-weight:700;font-size:14px}
      .bc-rm{background:none;border:none;color:${C.muted};font-size:12px;cursor:pointer;text-decoration:underline;padding:0}
      .bc-rm:hover{color:${C.primary}}
      .bc-pr{margin-left:auto;font-weight:700;font-size:15px;white-space:nowrap}
      .bc-line{display:flex;justify-content:space-between;font-size:14px;color:${C.muted};margin-bottom:6px}
      .bc-tot{display:flex;justify-content:space-between;font-weight:700;font-size:19px;color:${C.ink};margin:10px 0 16px}
      .bc-ship{background:${C.panel};border-radius:14px;padding:13px 15px;margin-bottom:16px}
      .bc-ship p{margin:0 0 9px;font-size:13px;font-weight:600;color:${C.ink}}
      .bc-ship b{color:${C.primary}}
      .bc-bar{height:8px;background:rgba(14,33,128,.12);border-radius:999px;overflow:hidden}
      .bc-bar i{display:block;height:100%;background:${C.primary};border-radius:999px;transition:width .4s ease}
      .bc-xs{margin-top:20px;border-top:1px solid ${C.line};padding-top:16px}
      .bc-xs h4{margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.primary}}
      .bc-xrow{display:flex;align-items:center;gap:12px;padding:10px 0}
      .bc-xth{width:52px;height:52px;flex:0 0 auto;border-radius:10px;background:${C.panel};overflow:hidden}
      .bc-xth img{width:100%;height:100%;object-fit:cover}
      .bc-xnm{font-weight:600;font-size:14px;margin:0}
      .bc-xpr{font-size:13px;color:${C.muted};margin:0}
      .bc-xadd{margin-left:auto;flex:0 0 auto;background:transparent;border:1px solid ${C.primary};color:${C.primary};font-family:'Work Sans';font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase;padding:8px 14px;border-radius:999px;cursor:pointer;transition:background .18s,color .18s}
      .bc-xadd:hover{background:${C.primary};color:${C.cream}}
      .bc-btn{display:block;width:100%;background:${C.primary};color:${C.cream};font-family:'Work Sans';font-weight:700;font-size:15px;letter-spacing:.06em;
        text-transform:uppercase;border:none;padding:16px;border-radius:999px;cursor:pointer;transition:transform .12s ease,background .2s;text-align:center}
      .bc-btn:hover{background:${C.ink}} .bc-btn:active{transform:scale(.98)}
      .bc-btn[disabled]{opacity:.45;cursor:not-allowed}
      .bc-gh{display:block;width:100%;background:transparent;color:${C.primary};font-weight:700;font-size:13px;letter-spacing:.04em;border:none;padding:12px;cursor:pointer;text-align:center;margin-top:6px}
      .bc-gh:hover{text-decoration:underline}
      .bc-empty{text-align:center;color:${C.muted};padding:60px 10px}
      .bc-empty svg{opacity:.4;margin-bottom:14px}
      .bc-fld{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
      .bc-fld label{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${C.primary}}
      .bc-fld input{border:1px solid ${C.line};border-radius:12px;padding:13px 14px;font-family:inherit;font-size:15px;color:${C.ink};background:${C.bg};outline:none;transition:border-color .2s}
      .bc-fld input:focus{border-color:${C.primary}}
      .bc-two{display:flex;gap:12px} .bc-two .bc-fld{flex:1}
      .bc-steps{display:flex;gap:8px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};margin-bottom:18px}
      .bc-steps span.on{color:${C.primary}}
      .bc-ok{text-align:center;padding:40px 10px}
      .bc-ok .bc-ic{width:72px;height:72px;border-radius:999px;background:${C.primary};display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
    `;
    document.head.appendChild(style);

    root = document.createElement("div");
    overlay = document.createElement("div"); overlay.className = "bc-ov"; overlay.addEventListener("click", close);
    drawer = document.createElement("div"); drawer.className = "bc-dr"; drawer.setAttribute("role","dialog"); drawer.setAttribute("aria-label","Panier");
    root.appendChild(overlay); root.appendChild(drawer);
    document.body.appendChild(root);
    renderShell(); renderBody();
  }

  function renderShell(){
    drawer.innerHTML = `<div class="bc-hd"><h2 class="bc-ttl" data-title>Votre panier</h2><button class="bc-x" aria-label="Fermer" data-close>×</button></div><div class="bc-body" data-body></div><div class="bc-foot" data-foot></div>`;
    body = drawer.querySelector("[data-body]");
    drawer.querySelector("[data-close]").addEventListener("click", close);
  }

  function stepsBar(){
    const s = (k,l)=>`<span class="${step===k?'on':''}">${l}</span>`;
    return `<div class="bc-steps">${s('cart','Panier')}<span>›</span>${s('livraison','Livraison')}<span>›</span>${s('paiement','Paiement')}</div>`;
  }

  function renderBody(){
    if (!mounted) return;
    const items = read();
    const foot = drawer.querySelector("[data-foot]");
    const title = drawer.querySelector("[data-title]");
    title.textContent = step==="confirmation" ? "Merci !" : step==="paiement" ? "Paiement" : step==="livraison" ? "Livraison" : "Votre panier";

    if (step === "confirmation"){
      body.innerHTML = `<div class="bc-ok"><div class="bc-ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${C.cream}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></div>
        <h3 style="font-family:'ruddy','Archivo Black',sans-serif;text-transform:uppercase;color:${C.primary};font-size:26px;margin:0 0 8px">Commande confirmée</h3>
        <p style="color:${C.muted};font-size:15px;line-height:1.5;margin:0">Un e-mail de confirmation vient de vous être envoyé. Votre commande est en préparation — merci pour votre confiance.</p></div>`;
      foot.innerHTML = `<button class="bc-btn" data-continue>Continuer mes achats</button>`;
      foot.querySelector("[data-continue]").addEventListener("click", close);
      return;
    }

    if (items.length === 0){
      body.innerHTML = `<div class="bc-empty"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${C.muted}" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 01-8 0"></path></svg><p>Votre panier est vide.</p></div>`;
      foot.innerHTML = `<button class="bc-btn" data-continue>Découvrir la boutique</button>`;
      foot.querySelector("[data-continue]").addEventListener("click", ()=>{ close(); location.href = "Nos Produits.dc.html"; });
      return;
    }

    if (step === "cart"){
      const sub = subtotal();
      const remain = Math.max(0, FREE_SHIP - sub);
      const pct = Math.min(100, Math.round(sub / FREE_SHIP * 100));
      const shipHtml = `<div class="bc-ship"><p>${remain>0 ? `Plus que <b>${euro(remain)}</b> pour la livraison offerte` : `🎉 Vous bénéficiez de la <b>livraison offerte</b>`}</p><div class="bc-bar"><i style="width:${pct}%"></i></div></div>`;
      const xs = crossSell();
      const xsHtml = xs.length ? `<div class="bc-xs"><h4>Complétez votre panier</h4>${xs.map(p=>`
        <div class="bc-xrow">
          <div class="bc-xth">${p.img?`<img src="${p.img}" alt="">`:""}</div>
          <div style="flex:1;min-width:0"><p class="bc-xnm">${p.name}</p><p class="bc-xpr">${p.variant} · ${euro(p.price)}</p></div>
          <button class="bc-xadd" data-xs="${p.id}">Ajouter</button>
        </div>`).join("")}</div>` : "";
      body.innerHTML = shipHtml + items.map((it,i)=>`
        <div class="bc-row">
          <div class="bc-th">${it.img?`<img src="${it.img}" alt="">`:""}</div>
          <div style="flex:1;min-width:0">
            <p class="bc-nm">${it.name}</p>
            <p class="bc-vr">${it.variant||""}</p>
            <div style="display:flex;align-items:center;gap:12px">
              <span class="bc-qt"><button data-dec="${i}">−</button><span>${it.qty}</span><button data-inc="${i}">+</button></span>
              <button class="bc-rm" data-rm="${i}">Retirer</button>
            </div>
          </div>
          <span class="bc-pr">${euro(it.price*it.qty)}</span>
        </div>`).join("") + xsHtml;
      body.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>api.setQty(+b.dataset.inc, items[+b.dataset.inc].qty+1));
      body.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>api.setQty(+b.dataset.dec, items[+b.dataset.dec].qty-1));
      body.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>api.remove(+b.dataset.rm));
      body.querySelectorAll("[data-xs]").forEach(b=>b.onclick=()=>{ const p=CATALOG.find(x=>x.id===b.dataset.xs); if(p){ const items2=read(); items2.push({id:p.id,name:p.name,variant:p.variant,price:p.price,img:p.img,qty:1}); write(items2); } });
      const ship = subtotal()>=FREE_SHIP || subtotal()===0 ? 0 : 4.9;
      foot.innerHTML = `
        <div class="bc-line"><span>Sous-total</span><span>${euro(subtotal())}</span></div>
        <div class="bc-line"><span>Livraison</span><span>${ship===0?"Offerte":euro(ship)}</span></div>
        <div class="bc-tot"><span>Total</span><span>${euro(subtotal()+ship)}</span></div>
        <button class="bc-btn" data-next>Passer commande</button>`;
      foot.querySelector("[data-next]").onclick=()=>{ step="livraison"; renderBody(); };
      return;
    }

    if (step === "livraison"){
      body.innerHTML = stepsBar() + `
        <div class="bc-two"><div class="bc-fld"><label>Prénom</label><input data-req id="bc-fn" placeholder="Camille"></div>
        <div class="bc-fld"><label>Nom</label><input data-req id="bc-ln" placeholder="Renard"></div></div>
        <div class="bc-fld"><label>E-mail</label><input data-req id="bc-em" type="email" placeholder="camille@exemple.fr"></div>
        <div class="bc-fld"><label>Adresse</label><input data-req id="bc-ad" placeholder="12 rue des Tilleuls"></div>
        <div class="bc-two"><div class="bc-fld"><label>Code postal</label><input data-req id="bc-cp" placeholder="75011"></div>
        <div class="bc-fld"><label>Ville</label><input data-req id="bc-vl" placeholder="Paris"></div></div>`;
      foot.innerHTML = `<button class="bc-btn" data-next>Continuer vers le paiement</button><button class="bc-gh" data-back>‹ Retour au panier</button>`;
      const btn = foot.querySelector("[data-next]");
      const check = ()=>{ btn.disabled = [...body.querySelectorAll("[data-req]")].some(i=>!i.value.trim()); };
      body.querySelectorAll("[data-req]").forEach(i=>i.addEventListener("input",check)); check();
      btn.onclick=()=>{ step="paiement"; renderBody(); };
      foot.querySelector("[data-back]").onclick=()=>{ step="cart"; renderBody(); };
      return;
    }

    if (step === "paiement"){
      const ship = subtotal()>=FREE_SHIP ? 0 : 4.9;
      body.innerHTML = stepsBar() + `
        <div class="bc-fld"><label>Numéro de carte</label><input data-req id="bc-cc" inputmode="numeric" placeholder="4242 4242 4242 4242"></div>
        <div class="bc-two"><div class="bc-fld"><label>Expiration</label><input data-req id="bc-ex" placeholder="09/28"></div>
        <div class="bc-fld"><label>CVC</label><input data-req id="bc-cv" inputmode="numeric" placeholder="123"></div></div>
        <div class="bc-fld"><label>Nom sur la carte</label><input data-req id="bc-cn" placeholder="Camille Renard"></div>
        <div class="bc-tot" style="margin-top:18px"><span>Total à payer</span><span>${euro(subtotal()+ship)}</span></div>`;
      foot.innerHTML = `<button class="bc-btn" data-pay>Payer ${euro(subtotal()+ship)}</button><button class="bc-gh" data-back>‹ Retour à la livraison</button>`;
      const btn = foot.querySelector("[data-pay]");
      const check = ()=>{ btn.disabled = [...body.querySelectorAll("[data-req]")].some(i=>!i.value.trim()); };
      body.querySelectorAll("[data-req]").forEach(i=>i.addEventListener("input",check)); check();
      btn.onclick=()=>{ api.clear(); step="confirmation"; renderBody(); };
      foot.querySelector("[data-back]").onclick=()=>{ step="livraison"; renderBody(); };
      return;
    }
  }

  function open(){ ensure(); requestAnimationFrame(()=>{ overlay.classList.add("on"); drawer.classList.add("on"); document.body.style.overflow="hidden"; }); }
  function close(){ if(!mounted) return; overlay.classList.remove("on"); drawer.classList.remove("on"); document.body.style.overflow=""; }

  document.addEventListener("keydown", e=>{ if(e.key==="Escape") close(); });
  document.addEventListener("click", e=>{ const t=e.target.closest("[data-cart-open]"); if(t){ e.preventDefault(); step="cart"; open(); } });

  // Quantity steppers + add-to-basket on product tiles (site-wide)
  document.addEventListener("click", e=>{
    const inc = e.target.closest("[data-bq-inc]");
    const dec = e.target.closest("[data-bq-dec]");
    const add = e.target.closest("[data-bq-add]");
    if (inc || dec){
      e.preventDefault();
      const wrap = (inc||dec).closest("[data-bq]");
      const out = wrap && wrap.querySelector("[data-bq-qty]");
      if (out){ let q = parseInt(out.textContent,10)||1; q = Math.max(1, q + (inc?1:-1)); out.textContent = q; }
      return;
    }
    if (add){
      e.preventDefault();
      const wrap = add.closest("[data-bq]");
      const out = wrap && wrap.querySelector("[data-bq-qty]");
      const qty = out ? (parseInt(out.textContent,10)||1) : 1;
      const items = read();
      const id = add.dataset.id, variant = add.dataset.variant || "";
      const f = items.find(i=>i.id===id && i.variant===variant);
      if (f) f.qty += qty; else items.push({ id, name: add.dataset.name, variant, price: parseFloat(add.dataset.price)||0, img: add.dataset.img, qty });
      step = "cart"; write(items); open();
    }
  });

  if (document.readyState!=="loading") syncBadges();
  else document.addEventListener("DOMContentLoaded", syncBadges);
})();
