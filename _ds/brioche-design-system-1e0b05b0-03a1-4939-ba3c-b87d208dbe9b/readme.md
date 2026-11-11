# Brioche Design System

**Brioche** is a boutique e-commerce brand selling premium accessories for dogs — leashes (`laisses`), collars (`colliers`), and objects for pets (`objets pour animaux`): leather goods, beds, bowls. The brief was to design the site's landing page, catalog, and product pages for a French-speaking audience.

## Sources
- `uploads/DESIGN-apple.md` — a structural/visual analysis of Apple's web design language (photography-first tiles, single accent color, quiet typography, pill CTAs, one reserved shadow). Brioche has **no existing brand assets** (no codebase, no Figma, no logo, no photography) — this analysis was used only as a loose structural reference for pacing and restraint, per the brief ("take general inspiration, adapt freely"). None of Apple's actual brand elements (name, mark, blue accent, SF Pro) carry over: colors, type, and copy below are original to Brioche.
- No logo, icon set, or product photography were supplied. See **Iconography** and **Assets** below for what was substituted and flagged.

## Index
- `styles.css` — root stylesheet, imports everything below.
- `tokens/` — `colors.css`, `fonts.css`, `typography.css`, `spacing.css`, `radii.css`, `shadows.css`, `base.css` (reset), `components.css` (shared classnames used by every component).
- `components/` — reusable UI primitives, grouped by concern:
  - `core/` — `Button`, `IconButton`, `Badge`
  - `navigation/` — `GlobalNav`, `SubNav`
  - `cards/` — `ProductTile`, `UtilityCard`, `OptionChip`
  - `forms/` — `SearchInput`
  - `feedback/` — `StickyBar`
  - `layout/` — `Footer`
- `ui_kits/brioche-site/` — the Home / Shop / Product Detail click-through (see its own README).
- `guidelines/` — foundation specimen cards (colors, type, spacing, shape, brand).
- `assets/image-slot.js` — drag-and-drop image placeholder component used everywhere real photography would go.
- `thumbnail.html` — project tile.

## Content Fundamentals
- **Language:** French, addressing the customer informally as *vous* (retail-standard French, not *tu*) — e.g. "Découvrir la boutique", "Ajouter au panier", "Retour à la boutique".
- **Tone:** premium and quiet, confident rather than salesy. Short declarative sentences; craftsmanship details stated plainly rather than hyped — *"Cuir tanné végétal, quincaillerie laiton massif, fabriqué en France"* rather than exclamation-heavy marketing copy.
- **Casing:** sentence case throughout (headlines, buttons, nav) — no ALL CAPS, no title case. Nav labels are simple nouns: "Laisses", "Colliers", "Accessoires".
- **Product naming:** each product carries a spice/pastry-adjacent first name playing on the "Brioche" brand — Noisette (hazelnut), Cannelle (cinnamon), Muscade (nutmeg), Gingembre (ginger), Vanille (vanilla), Réglisse (licorice). This is Brioche's signature naming convention and should be used for all future products.
- **Emoji:** never used — matches the quiet, editorial voice.
- **Numbers/pricing:** prices in euros with the `€` sign after the amount and a space ("48 €"), no decimals for whole prices.

## Visual Foundations
- **Color:** one accent color carries every interactive element — **Vert Brioche** `#2f6b4f` (a warm forest green, chosen over Apple's blue to feel natural/artisanal for a pet-goods boutique). A brighter on-dark variant (`#7bcf9e`) is used for links/CTAs sitting on dark tiles, where the base green would lose contrast. Neutrals are warm, not cool: near-black ink (`#241f1a`) instead of pure black for text, warm-white canvas (`#fffcf8`) and a **parchment/crust cream** (`#f6ead4`) for alternating sections — a nod to the brand name. Dark tiles step through three near-black browns (`#2a231d` → `#2e2620` → `#241e18`) for subtle separation when stacked; true black (`#16110c`) is reserved for the global nav bar only.
- **Type:** a warm serif display face (**Instrument Serif**, italic for airy/lead moments) paired with a clean grotesque body/UI face (**Work Sans**, 300–700). Serif carries hero headlines and tile titles for a boutique/editorial warmth; Work Sans carries everything functional (body, buttons, nav, captions). Both are Google Fonts substitutions — see **Font substitution** below.
- **Spacing:** an 8px-based scale from 4px to 96px. Full-bleed tiles use the top-level `--space-section` (96px) as vertical padding, edge to edge with zero gap between tiles — the color change between tiles **is** the section divider, no borders.
- **Backgrounds:** flat color fields only — no gradients, no textures, no patterns. Photography is full-bleed or resting on a tile background via `<image-slot>` placeholders (no real photography supplied yet).
- **Animation:** minimal and functional — buttons scale to 0.96 on press (the one system-wide micro-interaction), cards lift 3px on hover, chip borders tighten on hover/selection. No decorative motion, no bounce, no page-load animations.
- **Hover states:** primary buttons darken; secondary/ghost buttons invert to filled; nav links fade from 82%→100% opacity; utility cards lift slightly. Never a shadow appears on hover.
- **Press states:** `transform: scale(0.96)` on every button, matching a boutique's tactile, understated feel rather than color-flash feedback.
- **Borders/shadows:** almost no shadows in the system — **exactly one** shadow token (`--shadow-product`, a soft diffuse drop) is reserved for product photography resting on a surface. Cards, buttons, and chrome use a 1px hairline border instead of elevation.
- **Corner radii:** full-bleed tiles are perfectly square (`--radius-none`); utility/shop cards use a generous `20px` (`--radius-lg`); compact utility buttons use `8px`; the signature shape is the **full pill** (`999px`) reserved for every primary action — buttons, search input, configurator/filter chips.
- **Transparency/blur:** used sparingly and only functionally — the sub-nav and the product page's sticky add-to-cart bar are parchment at ~86–90% opacity with backdrop blur, so they read as "floating over content" while scrolling.
- **Imagery mood (intended, once real photography is supplied):** warm, natural light, shallow depth of field, un-staged — matching the warm palette. Placeholders currently stand in for all of this.
- **Cards:** flat white background, 1px hairline border, 20px radius, no shadow — product image sits inside at an 8px inner radius.

## Iconography
No icon set, icon font, or SVG sprite was supplied with the brief. **Lucide** (CDN, `unpkg.com/lucide`) is used as a substitution — a minimal, thin-stroke, no-fill icon set that matches the quiet/editorial visual language. Icons are mounted via `<i data-lucide="name">` + `lucide.createIcons()`, never emoji, never hand-drawn SVG. Used sparingly: search, shopping-bag, heart, menu, x, chevron-right, truck, paw-print.

## Assets
**No logo file was supplied.** Wherever a brand mark would sit, the wordmark "Brioche" is set in italic Instrument Serif — see `guidelines/brand-wordmark.card.html`. Do not draw or invent a logo mark; ask the user for one if needed.

## Font substitution — please read
No font files were supplied. The typeface direction requested was "RUDY" — this could not be matched to any legitimately licensed, production-ready typeface (the name maps only to unlicensed novelty/graffiti dingbat fonts, not a font suited to a premium minimal brand). **Instrument Serif** (display/headlines, warm italic) + **Work Sans** (body/UI) were substituted from Google Fonts as the closest fit to the "premium & minimal" direction you chose. **Please confirm this substitution or share the actual RUDY font files / a reference so we can match it precisely.**

## Components
Core: `Button`, `IconButton`, `Badge`. Navigation: `GlobalNav`, `SubNav`. Cards: `ProductTile`, `UtilityCard`, `OptionChip`. Forms: `SearchInput`. Feedback: `StickyBar`. Layout: `Footer`.

### Intentional additions
No source (codebase/Figma) defined a component inventory, so a from-scratch set was authored, sized to what a single boutique landing/shop/product flow needs — no Toast, Tabs, or Dialog, since nothing in the three screens calls for them yet.

## UI Kit
`ui_kits/brioche-site/` — an interactive click-through covering Home, Shop/Catalog, and Product Detail (see its own `README.md`).
