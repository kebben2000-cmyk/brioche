/* Brioche — bilingue FR/EN + devise €/$ (sélecteur header, persistant) */
(function () {
  const LKEY = "brioche-lang";
  let lang = localStorage.getItem(LKEY) || "fr";

  // Dictionnaire FR -> EN (chrome partagé + libellés produits courants)
  const DICT = {
    // Nav
    "Accueil":"Home","ACCUEIL":"HOME",
    "Nos produits":"Shop","NOS PRODUITS":"SHOP","Nos\u00a0produits":"Shop",
    "Avis":"Reviews","AVIS":"REVIEWS",
    "À propos":"About","Contact":"Contact",
    "La boutique":"Shop now","LA BOUTIQUE":"SHOP NOW",
    "Journal":"Journal","Boutique":"Shop","Maison":"Company",
    // CTA / boutons
    "Ajouter au panier":"Add to cart","Ajouté au panier ✓":"Added to cart ✓",
    "Passer commande":"Checkout","Découvrir la boutique":"Shop the collection",
    "Continuer mes achats":"Continue shopping","Continuer vers le paiement":"Continue to payment",
    "Publier mon avis":"Post my review","Merci pour votre avis ✓":"Thanks for your review ✓",
    "Voir le produit":"View product","Voir la boutique":"View shop",
    "Rejoignez la famille Brioche":"Join the Brioche family",
    // Panier
    "Votre panier":"Your cart","Panier":"Cart","Livraison":"Shipping","Paiement":"Payment",
    "Merci !":"Thank you!","Votre panier est vide.":"Your cart is empty.",
    "Sous-total":"Subtotal","Total":"Total","Total à payer":"Total due",
    "Offerte":"Free","Retirer":"Remove","Complétez votre panier":"Complete your cart","Ajouter":"Add",
    "Commande confirmée":"Order confirmed",
    "Prénom":"First name","Nom":"Last name","E-mail":"Email","Adresse":"Address",
    "Code postal":"ZIP code","Ville":"City","Numéro de carte":"Card number",
    "Expiration":"Expiry","Nom sur la carte":"Name on card",
    "Retour au panier":"Back to cart","Retour à la livraison":"Back to shipping",
    "Continuer mes achats":"Continue shopping",
    // Réassurance / paiement
    "Paiement sécurisé":"Secure payment","Livraison rapide":"Fast delivery",
    "Retour sous 30 jours":"30-day returns","Paiement 100% sécurisé":"100% secure checkout",
    "Paiements acceptés":"Accepted payments","Livraison offerte dès 60 €":"Free shipping over $65",
    "Sans BPA · étanche":"BPA-free · leak-proof",
    // Produits / fiche
    "Coloris":"Color","Nouveau":"New","Best-seller":"Best-seller","Rando":"Trail","Anti-stress":"Anti-stress",
    "Nos indispensables":"Our essentials","Ils adorent":"They love it","Le concept en action":"See it in action",
    "Notre histoire":"Our story","Ce qui nous tient à cœur":"What we stand for",
    "Votre expérience":"Your experience","Je laisse un avis":"Leave a review",
    "Votre note":"Your rating","Votre nom":"Your name","Le nom de votre chien":"Your dog's name","Votre avis":"Your review",
    // Footer
    "Accessoires pour chiens, fabriqués en France. Cuir tanné végétal, laiton massif.":"Dog accessories, made in France. Veg-tanned leather, solid brass.",
    "Laisses":"Leashes","Colliers":"Collars","Couchages":"Beds",
    "© 2026 Brioche — Fabriqué en France":"© 2026 Brioche — Made in France"
  };
  Object.assign(DICT, {
    // Titres fragmentés (héros / sections)
    "Nos":"Our","indispensables":"essentials",
    "Facilite ta":"Make","promenade pour":"walks easier for","toi et ton chien":"you and your dog",
    "La liberté,":"Freedom,","tenue en main":"in your hand",
    "Pensé pour vos":"Designed for your","plus belles balades":"best walks ever",
    "Pourquoi Brioche":"Why Brioche","Ils adorent Brioche":"They love Brioche",
    "À votre tour d'essayer":"Your turn to try","Avis clients":"Customer reviews",
    // Sous-titres / accroches
    "Des laisses main libre pensées pour le confort de votre chien — et le vôtre. Choisissez votre coloris.":"Hands-free leashes designed for your dog's comfort — and yours. Choose your color.",
    "Chaque pièce Brioche est pensée pour le confort de votre chien ainsi que son maître.":"Every Brioche piece is designed for the comfort of your dog and its owner.",
    "Une laisse rétractable pensée pour la balade : le confort pour vous, la liberté pour votre chien.":"A retractable leash designed for walks: comfort for you, freedom for your dog.",
    "Gardez vos mains disponibles pendant vos promenades.":"Keep your hands free during your walks.",
    "Gardez vos mains disponibles pendant toute la promenade de votre chien.":"Keep your hands free throughout your dog's walk.",
    "Vous restez libre de vos mouvements.":"You stay free to move.",
    "Ce que nos clients et leurs chiens pensent de nos accessoires. Exemples à titre indicatif.":"What our customers and their dogs think of our accessories. Sample reviews.",
    "Partagez votre expérience avec Brioche et votre chien. Formulaire de démonstration.":"Share your experience with Brioche and your dog. Demo form.",
    "Découvrez nos accessoires pensés pour des balades plus douces, pour vous et votre chien.":"Discover our accessories designed for gentler walks, for you and your dog.",
    "Trois engagements que nous ne négocions jamais.":"Three commitments we never compromise on.",
    // Valeurs "Ce qui nous tient à cœur"
    "Bien-être du duo":"Wellbeing of the duo","Service humain":"Human service","Liberté en confiance":"Freedom with confidence",
    "Confort ergonomique":"Ergonomic comfort","Design minimaliste":"Minimalist design",
    "Pensé pour l'équilibre physique et mental de l'humain comme du chien : des balades plus douces, plus sûres, plus complices.":"Designed for the physical and mental balance of human and dog alike: gentler, safer, closer walks.",
    "Des accessoires fiables qui laissent votre chien libre de ses mouvements, tout en gardant le contrôle en toute sérénité.":"Reliable accessories that let your dog move freely while you keep calm control.",
    "Une vraie équipe qui vous répond, un retour sous 30 jours et des conseils pour choisir le bon produit.":"A real team that answers you, 30-day returns and advice to choose the right product.",
    "Des matières élégantes et une esthétique intemporelle, faites pour le quotidien.":"Elegant materials and timeless aesthetics, made for everyday life.",
    // À propos
    "Notre histoire":"Our story","Brioche, née d'une balade":"Brioche, born on a walk","La personne derrière la marque":"The person behind the brand",
    "Nous proposons des accessoires pour chiens qui rendent chaque promenade plus simple et plus belle. Des matières durables, un design pensé pour le confort du maître comme du chien.":"We make dog accessories that make every walk simpler and more beautiful. Durable materials, a design focused on the comfort of owner and dog alike.",
    "Bonjour, moi c'est":"Hi, I'm",
    ", fondatrice de Brioche et heureuse propriétaire de Gaufre, un corgi plein d'énergie. Tout est parti d'une frustration simple : impossible de trouver une laisse à la fois pratique, solide et jolie pour nos balades quotidiennes.":", founder of Brioche and happy owner of Gaufre, an energetic corgi. It all started from a simple frustration: I couldn't find a leash that was practical, sturdy and beautiful for our daily walks.",
    "Alors j'ai décidé de la créer. Chaque produit Brioche est testé sur le terrain, avec de vrais chiens, avant d'arriver chez vous. Notre promesse : des accessoires qui durent, un service à taille humaine, et une équipe qui répond vraiment quand vous nous écrivez.":"So I decided to create it. Every Brioche product is field-tested, with real dogs, before it reaches you. Our promise: accessories that last, a human-scale service, and a team that truly answers when you write to us.",
    "« Un chien bien accompagné, c'est un maître serein. »":"“A well-supported dog means a peaceful owner.”",
    "— Camille, fondatrice de Brioche":"— Camille, founder of Brioche",
    // Produits — noms & lignes
    "Laisse Main Libre":"Hands-Free Leash","Laisse LED Rétractable":"Retractable LED Leash","Laisse rétractable LED lumineuse":"Illuminated LED retractable leash",
    "Laisse rétractable LED":"LED retractable leash","Laisse LED · lampe torche · 3 m":"LED leash · flashlight · 3 m","LED 7 couleurs · corde 2 m":"7-color LED · 2 m cord",
    "Gourde Balade":"Trail Bottle","Gourde + gamelle 2-en-1":"2-in-1 bottle + bowl","Gourde & gamelle 2-en-1":"2-in-1 bottle & bowl","Gourde + gamelle 2-en-1 · 4 coloris":"2-in-1 bottle + bowl · 4 colors",
    "Boule de léchage":"Lick Ball","Tapis de léchage à ventouse":"Suction lick mat","Tapis anti-glouton · ventouse · 4 coloris":"Anti-gulp mat · suction · 4 colors",
    "Rétractable 2,5 m · 6 coloris":"Retractable 2.5 m · 6 colors","Rétractable 2,5 m":"Retractable 2.5 m",
    // Descriptions produits
    "Pensée pour les randos et les longues balades, la Gourde Balade réunit l'eau et les croquettes dans un seul objet compact. Bec verseur en forme d'os, réservoir à eau étanche et compartiment à croquettes qui se transforme en gamelle : votre chien s'hydrate et se nourrit partout, d'une seule main.":"Designed for hikes and long walks, the Trail Bottle combines water and kibble in one compact object. Bone-shaped spout, leak-proof water reservoir and a kibble compartment that turns into a bowl: your dog drinks and eats anywhere, one-handed.",
    "La Réglisse illumine vos balades du soir. Bandeau LED RGB multicolore, lampe torche intégrée et sangle rétractable de 3 m à traction libre : votre chien reste visible et vous gardez les mains libres, de jour comme de nuit.":"The Réglisse lights up your evening walks. Multicolor RGB LED strip, built-in flashlight and a 3 m free-pull retractable strap: your dog stays visible and your hands stay free, day and night.",
    "La Boule de léchage occupe votre chien et l'apaise. Garnissez le dôme central de pâtée, yaourt, purée de fruits ou pâtée humide : votre chien lèche longuement, ralentit sa prise alimentaire et se détend. La large ventouse maintient la coupelle en place — idéale pour le toilettage, la coupe des griffes ou les visites chez le vétérinaire.":"The Lick Ball keeps your dog busy and calm. Fill the central dome with pâté, yogurt, fruit purée or wet food: your dog licks for a long time, slows its eating and relaxes. The wide suction cup holds the dish in place — ideal for grooming, nail trimming or vet visits.",
    // Fiche : sections & labels
    "Le produit en situation":"The product in use","En vidéo":"In video","Le concept en action":"See it in action",
    "Main libre":"Hands-free","Mains libres":"Hands-free","Blocage sécurisé":"Secure lock","Poignée ergo":"Ergo handle","En balade":"On a walk",
    "Coloris ·":"Color ·","Taille ·":"Size ·","avis vérifiés":"verified reviews",
    "4,9/5 · 1 240 avis vérifiés":"4.9/5 · 1,240 verified reviews","Sur 1 240 avis vérifiés":"Out of 1,240 verified reviews",
    // Avis
    "Ils adorent":"They love it","Achat vérifié":"Verified purchase","Bientôt":"Coming soon",
    "Propriétaire de Ozy":"Ozy's owner","Propriétaire de Romeo":"Romeo's owner","Propriétaire de Spyx":"Spyx's owner","Propriétaire de Gaufre":"Gaufre's owner","Propriétaire de Praline":"Praline's owner","Propriétaire de Brioche":"Brioche's owner",
    "« Collier Cannelle magnifique et solide. J'aurais aimé une taille intermédiaire pour mon corgi, mais la finition laiton est parfaite. »":"“The Cannelle collar is gorgeous and sturdy. I'd have loved a mid-size for my corgi, but the brass finish is perfect.”",
    "« La laisse Noisette est superbe et le cuir sent divinement bon. Deux mois d'usage quotidien et elle est comme neuve. »":"“The Noisette leash is stunning and the leather smells divine. Two months of daily use and it looks brand new.”",
    "« Le couchage Muscade a transformé les nuits de mon chien. Housse déhoussable très pratique, et fabriqué en France, ça compte pour moi. »":"“The Muscade bed transformed my dog's nights. The removable cover is so handy, and made in France matters to me.”",
    "Une dragonne souple et confortable, pensée pour les longues balades.":"A soft, comfortable wrist strap, designed for long walks.",
    "Un système de verrouillage qui empêche la laisse de glisser ou de se relâcher.":"A locking system that stops the leash from slipping or loosening.",
    // Footer / contact
    "Contact : briochepet@gmail.com":"Contact: briochepet@gmail.com"
  });

  // Conversion prix € -> $ (table + repli x1,1 arrondi)
  const PRICE = { "15":"17","20":"22","29":"32","35":"39","36":"39","39":"43","48":"52","55":"59","59":"65","120":"129" };
  function eurToUsd(n){ return PRICE[n] || String(Math.round(parseInt(n,10) * 1.1)); }

  function translateText(t){
    const key = t.trim();
    if (!key) return t;
    if (DICT[key]) return t.replace(key, DICT[key]);
    return t;
  }
  function convertPrices(t){
    // "35 €" / "35,90 €" -> "$39"
    return t.replace(/(\d+)(?:[.,](\d+))?\s*€/g, (m, whole) => "$" + eurToUsd(whole));
  }

  const FRO = new WeakMap();      // node -> texte français d'origine
  const FRPH = new WeakMap();     // node -> placeholder français d'origine

  function walk(node){
    if (node.nodeType === 3){ // text
      const orig = FRO.has(node) ? FRO.get(node) : node.nodeValue;
      if (lang === "en"){
        if (!FRO.has(node)) FRO.set(node, node.nodeValue);
        let v = convertPrices(translateText(orig));
        if (v !== node.nodeValue) node.nodeValue = v;
      } else {
        if (FRO.has(node) && node.nodeValue !== orig) node.nodeValue = orig;
      }
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.hasAttribute && node.hasAttribute("data-i18n-skip")) return;
    if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
    // placeholders
    if (node.placeholder !== undefined && node.placeholder !== ""){
      const po = FRPH.has(node) ? FRPH.get(node) : node.placeholder;
      if (lang === "en"){
        if (!FRPH.has(node)) FRPH.set(node, node.placeholder);
        if (DICT[po.trim()]) node.placeholder = DICT[po.trim()];
      } else if (FRPH.has(node) && node.placeholder !== po){
        node.placeholder = po;
      }
    }
    for (let c = node.firstChild; c; c = c.nextSibling) walk(c);
  }

  function applyLang(){
    document.documentElement.lang = lang;
    walk(document.body);
    updateSwitch();
  }

  // Sélecteur FR/EN inséré dans le header
  function makeSwitch(){
    const wrap = document.createElement("div");
    wrap.setAttribute("data-i18n-skip","");
    wrap.style.cssText = "display:flex;align-items:center;gap:2px;border:1px solid rgba(14,33,128,.24);border-radius:999px;padding:3px;flex:0 0 auto";
    ["fr","en"].forEach(l=>{
      const b = document.createElement("button");
      b.textContent = l.toUpperCase();
      b.setAttribute("data-lang-btn", l);
      b.style.cssText = "border:none;background:transparent;cursor:pointer;font-family:'Work Sans',sans-serif;font-weight:700;font-size:12px;letter-spacing:.04em;padding:6px 10px;border-radius:999px;color:#0E2180;transition:background .2s,color .2s";
      b.onclick = () => { if (l===lang) return; lang=l; localStorage.setItem(LKEY,l); applyLang(); };
      wrap.appendChild(b);
    });
    return wrap;
  }
  function updateSwitch(){
    document.querySelectorAll("[data-lang-btn]").forEach(b=>{
      const on = b.getAttribute("data-lang-btn")===lang;
      b.style.background = on ? "#0E2180" : "transparent";
      b.style.color = on ? "#f0e7cf" : "#0E2180";
    });
  }
  function mountSwitch(){
    if (document.querySelector("[data-lang-btn]")) return;
    const cartBtn = document.querySelector("[data-cart-open]");
    if (cartBtn && cartBtn.parentElement){
      cartBtn.parentElement.insertBefore(makeSwitch(), cartBtn);
    } else {
      const nav = document.querySelector("header nav");
      if (nav && nav.parentElement) nav.parentElement.insertBefore(makeSwitch(), nav.nextSibling);
    }
    updateSwitch();
  }

  let scheduled = false;
  function ensure(){
    mountSwitch();
    walk(document.body);
    updateSwitch();
  }
  function schedule(){ if (scheduled) return; scheduled = true; requestAnimationFrame(()=>{ scheduled = false; ensure(); }); }

  function init(){
    ensure();
    // Le runtime re-rend le header (efface le bouton) et injecte du contenu (panier) :
    // un observer permanent ré-insère le sélecteur et re-traduit en continu.
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, { childList:true, subtree:true });
    // filet de sécurité pendant le rendu initial en streaming
    let tries = 0;
    const iv = setInterval(()=>{ ensure(); if (++tries > 20) clearInterval(iv); }, 250);
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
