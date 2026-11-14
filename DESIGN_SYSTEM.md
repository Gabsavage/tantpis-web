# TANT PIS. — Design System
> Document de référence DA — à respecter à la lettre
> Toute décision visuelle non couverte ici doit suivre la règle la plus restrictive

---

## PALETTE — Usage exact

### #F2E8DC — Crème (dominant)
- Fond de 90% des surfaces
- Background body, cards, sections
- **Interdit** : utiliser #FFFFFF (blanc pur) — toujours #F2E8DC minimum

### #C2604A — Terracotta (accent)
- CTA principal (un seul par page)
- Fond des sections "manifeste" ou d'impact — max 2 sections par page
- Hover sur liens
- Ticker en haut de page
- Bullet points décoratifs
- **Max 20% des surfaces — jamais sur 2 sections consécutives**

### #2A1810 — Brun foncé (texte & impact)
- Texte principal
- Footer background
- Section finale d'impact (alternative au terracotta)
- **Jamais utilisé avec le terracotta sur la même section**

### #7A4F3A — Tabac (secondaire)
- Texte secondaire
- Labels, captions, numéros de section
- Dates, mentions, attributions

### #8A9E8C — Sauge (touch)
- Maximum 1 élément par page (point décoratif, séparateur)
- **Jamais dominant, jamais en fond**

### COULEURS INTERDITES
- Tout rose, fuchsia, magenta, violet, orange vif
- Toute couleur hors palette ci-dessus
- #FFFFFF blanc pur

---

## TYPOGRAPHIE — Usage exact

### Headlines — Cormorant Garamond Italic (weight 500)
```
font-family: 'Cormorant Garamond', serif;
font-style: italic;
font-weight: 500;
```
- Hero : 80–140px desktop / 48–72px mobile
- Section : 48–72px desktop
- **Toujours italic — jamais bold, jamais regular**
- Couleur : #2A1810 sur fond crème / #F2E8DC sur fond foncé
- line-height : 0.9–1.05 (serré, éditorial)
- Pas de text-transform

### Corps — Inter Regular (weight 400)
```
font-family: 'Inter', sans-serif;
font-weight: 400;
font-size: 15–16px;
line-height: 1.65;
```
- Couleur : #2A1810 ou #7A4F3A
- max-width des blocs : 520px

### Labels & Caps — Inter Medium (weight 500)
```
font-family: 'Inter', sans-serif;
font-weight: 500;
font-size: 10–11px;
letter-spacing: 0.14–0.18em;
text-transform: uppercase;
```
- Couleur : #7A4F3A
- Usage : numéros de section, catégories, attributions
- Format numéro de section : "01 — NOM DE SECTION"

### Combinaison signature
> Grande serif italic + petite sans uppercase = l'identité typographique de Tant Pis.
> Ne jamais mélanger deux styles de même taille.

---

## ÉLÉMENTS SIGNATURE

### Ticker (barre défilante en haut de page)
- Fond : #C2604A
- Texte : #F2E8DC
- Font : Inter 500, uppercase, 10px, letter-spacing 0.14em
- Défilement lent et continu
- C'est le seul endroit où le terracotta est permanent

### Numéros de section
- Format : "01 — NOM DE SECTION"
- Inter 500, 10px, uppercase, #7A4F3A
- Placés en haut à gauche des sections
- Toujours présents pour baliser la page

### Témoignages
- Guillemets « » en Cormorant Garamond Italic, grande taille, #C2604A
- Texte en Cormorant Italic, #2A1810
- Attribution en Inter caps, #7A4F3A
- Format : "@handle · VILLE"

### CTA — Un seul style, aucune exception
```css
background: #C2604A;
color: #F2E8DC;
font-family: 'Inter', sans-serif;
font-weight: 500;
font-size: 11px;
letter-spacing: 0.14em;
text-transform: uppercase;
border-radius: 0px; /* carré, toujours */
padding: 14px 24px;
```
- Format du texte : "JE LE PRENDS — 25 € →"
- Le prix est toujours dans le bouton
- Un seul CTA principal par section

### Le bisou — Règle absolue
- Uniquement dans le logo, version SVG
- Taille : celle d'un point typographique
- **Interdit partout ailleurs sur le site**
- **Interdit en emoji Apple (ni 👄 ni 💋 ni aucun emoji en élément décoratif)**

### Sections d'impact
- Fond terracotta #C2604A OU fond brun foncé #2A1810 — jamais les deux sur la même page
- Texte toujours en Cormorant Italic grande taille
- Couleur texte : #F2E8DC sur fond foncé
- Maximum 2 sections d'impact par page

---

## LAYOUT & ESPACEMENTS

### Espacements
- Sections : padding vertical 80–120px desktop / 48–64px mobile
- Marges latérales : 5–6% de la largeur viewport
- Pas de container max-width strict — laisser la typo respirer

### Structure de page
- Alternance : full width / split gauche-droite
- Images produit : 50–60% de la largeur sur split
- Jamais plus de 3 colonnes

### Séparateurs
- Ligne fine : 0.5px solid #7A4F3A — sparingly
- **Pas de border-radius > 2px**
- **Pas de box-shadow**
- **Pas de gradients**

### Images
- Toujours sur fond #F2E8DC ou texture naturelle (lin, béton)
- **Jamais fond blanc pur**
- Style : lumière naturelle chaude, textures visibles
- Produit en contexte lifestyle — jamais packshot isolé

---

## LISTE NOIRE — Interdit sans exception

```
❌ Toute couleur hors palette (surtout fuchsia/rose/magenta)
❌ #FFFFFF blanc pur en fond
❌ Emoji Apple en élément décoratif (aucun emoji en grand)
❌ Gradients (background: linear-gradient interdit)
❌ box-shadow
❌ border-radius > 2px
❌ Cormorant Garamond en Regular ou Bold
❌ Inter en weight 300 (disparaît à l'écran)
❌ Autres fonts (une seule font déco : Cormorant)
❌ Animations rapides (prefers: ease, duration > 0.4s)
❌ Fond coloré sur la navbar (toujours crème transparente)
❌ Le bisou en grand / en emoji / en illustration décorative
❌ Deux sections d'impact consécutives même couleur
❌ Prix affiché sans le symbole € collé au chiffre (22€ → 22 €)
```

---

## RÉFÉRENCES VISUELLES
- **Aesop** — cohérence absolue, chaque détail compte
- **COS** — minimalisme avec du caractère, pas austère
- **Diptyque** — premium accessible, typographie forte
- Objectif : le tiers-espace entre ces trois références, avec de l'attitude

## CE QUI N'EST PAS TANT PIS.
- Glossier (trop pink, trop girl boss)
- Alo Yoga (trop performance, trop US)
- N'importe quelle marque de yoga générique fond blanc
- Y2K revival / Barbie energy
- Wellness moralisateur