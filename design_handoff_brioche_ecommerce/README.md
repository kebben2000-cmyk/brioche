# Handoff : Brioche — Site e-commerce (accessoires pour chiens)

## Overview
Brioche est une boutique en ligne francophone d'accessoires premium pour chiens (laisses main libre, laisse LED, gourde 2-en-1, boule de léchage). Ce paquet contient le design complet du site : landing page, catalogue, 4 fiches produit, page « À propos », page « Avis », panier avec tunnel de paiement, et bascule de langue FR/EN.

## About the Design Files
Les fichiers de ce paquet sont des **références de design réalisées en HTML** — des prototypes qui montrent l'apparence et le comportement attendus, **pas du code de production à copier tel quel**.

La mission est de **recréer ces designs dans l'environnement existant du codebase cible** (React, Vue, Next.js, Shopify, etc.) en suivant ses conventions, ses composants et ses librairies. Si aucun environnement n'existe encore, choisir le framework le plus adapté (une boutique de ce type se prête bien à Next.js + un back-end e-commerce, ou Shopify) et y implémenter les designs.

Note technique : les `.dc.html` sont des composants d'un runtime de prototypage (templates avec trous `{{ }}` et une classe de logique). Ne pas porter ce runtime — lire le template et la logique comme **spécification** et réimplémenter avec les patterns du projet.

## Fidelity
**High-fidelity (hifi).** Couleurs, typographies, espacements, rayons, états de survol et interactions sont définitifs. L'UI doit être recréée fidèlement, en s'appuyant sur les librairies du codebase.

## Screens / Views

### 1. Landing page — `Brioche Landing.dc.html`
- **Purpose** : présenter la marque et convertir vers les fiches produit.
- **Layout** (de haut en bas) :
  1. **Header sticky** — bande tricolore de 6px (`linear-gradient(90deg,#0E2180 0 33.33%,#f7f7f9 33.33% 66.66%,#e63b2e 66.66% 100%)`), puis rangée : logo à gauche, nav centrée (Accueil · Nos produits · À propos · Avis · Contact), à droite bascule FR/EN + panier + pastille « La boutique ». Fond `rgba(243,239,225,.92)` + `backdrop-filter: blur(10px)`.
     - **Mobile (≤768px)** : burger à gauche (menu déroulant pleine largeur), logo centré, FR/EN + panier à droite. Nav masquée par défaut, dépliée par une checkbox CSS.
  2. **Hero** — scène à ratio verrouillé (`aspect-ratio: 1440/820` desktop, `41/47` mobile) avec éléments positionnés en `%` : motif beige en fond, wordmark « Brioche », chien détouré (séquence d'images animée), tampon vert rond, os « Better Together », vague bleue en bas. Tous les éléments scalent ensemble.
  3. **Nos indispensables** — fond bleu `#0E438D`, titre + grille de 3 cartes produit (image carrée, badge, nom, prix, description). Survol : seconde photo en fondu.
  4. **Bande motif** à pattes/cœurs (`repeat-x`).
  5. **Facilite ta promenade** — section bleue, logo crème, titre, paragraphe, CTA crème, deux chiens détourés animés sur les côtés.
  6. **Pourquoi Brioche** — 4 paires carte + vidéo. Desktop : grille 2×2. **Mobile : section épinglée** (`position: sticky`) où le scroll change la carte affichée, avec bouton « skip » en bas à droite.
  7. **Nos produits** — fond `#234288`, 2 lignes de 2 cartes, sticker os débordant du coin, sélecteur de quantité et bouton « Ajouter au panier ».
  8. **Ils adorent** — 3 avis étoilés en cartes (carrousel glissable sur mobile).
  9. **Réseaux sociaux** — 3 reels format téléphone (TikTok / Instagram / Reels), son au survol, tampon vert.
  10. **FAQ**, **bandeau de réassurance**, **bandeau défilant beige**, **footer** bleu.

### 2. Catalogue — `Nos Produits.dc.html`
Grille de 4 cartes produit (image carrée sur fond crème uniforme, sticker os incliné avec badge, nom, accroche, prix, note), puis bandeau défilant, bande motif, vidéo pleine largeur (son au survol), bande motif, FAQ, réassurance, footer.

### 3. Fiches produit — `Fiche Produit.dc.html` (laisse main libre, 3 coloris), `Fiche Produit LED.dc.html`, `Fiche Produit Gourde.dc.html`, `Fiche Produit Boule.dc.html`
- **Layout** : fil d'ariane, puis grille 2 colonnes (`1.05fr / .95fr`, 1 colonne sous 900px) :
  - **Gauche** : carrousel (piste `translateX`, flèches, points, miniatures 6 colonnes), sticky à `top: 96px`.
  - **Droite** : catégorie, titre (`ruddy`, uppercase, `clamp(44px,6vw,76px)`), étoiles + note + nombre d'avis, prix, description, sélecteur de coloris (pastilles — changent l'image principale sans polluer les miniatures), liste de caractéristiques à coches, sélecteur de quantité + « Ajouter au panier », pastilles de réassurance (paiement sécurisé, livraison rapide, retour 30 jours) et logos de paiement.
- Puis : 3 vidéos carrées légendées (Main libre / Blocage sécurisé / Poignée ergo), FAQ produit sur fond bleu, bande motif, footer.

### 4. À propos — `A propos.dc.html`
Hero éditorial, portrait + histoire de la fondatrice (emplacement image à remplir), citation, 3 valeurs (bien-être du duo, service humain, liberté en confiance), CTA.

### 5. Avis — `Avis.dc.html`
Note globale, répartition par étoiles, cartes d'avis, formulaire « Je laisse un avis » (étoiles cliquables, nom, nom du chien, commentaire).

## Interactions & Behavior
- **Panier** (`assets/cart-drawer.js`) : drawer coulissant depuis la droite (`transform: translateX(100%)` → `none`, `.42s cubic-bezier(.22,1,.36,1)`), overlay `rgba(20,17,45,.42)`. Ajout/retrait, quantités, sous-total, **livraison offerte dès 50 €** avec barre de progression, cross-sell « Complétez votre panier », tunnel **Panier → Livraison → Paiement → Confirmation** avec validation des champs. Persisté en `localStorage` (clé `brioche-cart-v1`), partagé entre toutes les pages. Badge de compteur dans chaque header.
- **Bascule FR/EN** (`assets/i18n.js`) : dictionnaire de chaînes + conversion des prix, préférence en `localStorage`.
- **Section épinglée** (`assets/why-pin.js`) : sur mobile, le scroll pilote la carte active (opacité + `scale`), bouton « skip » qui saute la section.
- **Carrousel glissable** (`assets/drag-scroll.js`) : glisser-maintenir à la souris/au doigt, `scroll-snap` désactivé pendant le glissement.
- **Survol produit** : deuxième photo en fondu (`opacity`, `.4s`).
- **Vidéos** : `autoplay loop muted playsinline`, son activé au survol uniquement (`onmouseenter → muted=false`).
- **Boutons** : `transform: scale(.96/.97)` au clic, changement de fond au survol.
- **Responsive** : desktop / laptop / mobile ; breakpoints principaux **900px** (grilles 1 colonne), **768px** (recomposition mobile, burger), **560px**.

## State Management
- Panier : liste d'articles `{id, name, variant, price, img, qty}` + étape du tunnel — global, persistant.
- Fiche produit : index du carrousel, coloris actif, taille active (boule), quantité, état « ajouté ».
- Langue : `fr` | `en`, persistée.
- Section épinglée : index de la carte active dérivé du scroll.

## Design Tokens
**Couleurs**
| Rôle | Valeur |
|---|---|
| Bleu principal | `#0E2180` |
| Bleu section | `#0E438D` |
| Bleu « Nos produits » | `#234288` |
| Encre | `#26224f` / `#23214d` |
| Crème / beige clair | `#f4ead2` · `#f0e7cf` · `#f3efe1` |
| Blanc cassé (cartes) | `#fffdf9` |
| Texte secondaire | `#5b567a` · `#8983b0` · `#8a8598` |
| Rouge accent (stickers) | `#c8352a` · `#e63b2e` |
| Vert (validation) | `#2f6b4f` |

**Typographies** — `ruddy` (Adobe Fonts, `https://use.typekit.net/apo6lqf.css`) pour les titres display en capitales ; `Work Sans` 400–800 pour l'UI et le corps ; `Instrument Serif` pour les noms de produit et citations. Fallback : `Archivo Black`.

**Échelles** — espacements en `clamp()` (ex. `clamp(18px,2.8vw,40px)`) ; rayons `8px` (images), `14–20px` (cartes), `999px` (pastilles/boutons) ; ombres douces `0 10px 26px rgba(14,33,128,.08)` → `0 22px 44px rgba(14,33,128,.20)` au survol.

## Assets
Tous les visuels sont dans `assets/` et à la racine du projet : logos (`logo-brioche-indigo.png`, `logo-brioche-beige.png`), packshots normalisés (`card-*.png`), photos produit par coloris, chiens détourés, motifs (`paw-band-hearts.png`, `pattern-beige-home-page-*.png`), stickers (`sticker-blank.png`, `badge-vert-*.png`), glyphes du bandeau défilant, vidéos `.mp4`.
- Les visuels produit ont été extraits/normalisés depuis les photos fournies par le client — **demander les originaux haute résolution** pour la production.
- La police **ruddy** nécessite un kit Adobe Fonts valide sur le domaine de production.
- Le portrait de la fondatrice (page À propos) est un **emplacement vide à remplir**.

## Files
Pages : `Brioche Landing.dc.html`, `Nos Produits.dc.html`, `Fiche Produit.dc.html`, `Fiche Produit LED.dc.html`, `Fiche Produit Gourde.dc.html`, `Fiche Produit Boule.dc.html`, `A propos.dc.html`, `Avis.dc.html`.
Scripts : `assets/cart-drawer.js` (panier + checkout), `assets/i18n.js` (FR/EN), `assets/why-pin.js` (section épinglée), `assets/swipe-deck.js` (deck swipe mobile), `assets/drag-scroll.js` (carrousel), `assets/premium-anim.js` (animations au scroll).
