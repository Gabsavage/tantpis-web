# Tant Pis.

Site e-commerce DTC pour la marque Tant Pis. — grip socks Pilates, marché français.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + variables CSS pour la palette
- Framer Motion pour les animations
- Zustand (persist) pour le panier
- Stripe Checkout hosted pour le paiement
- Vercel pour le déploiement

## Variables d'environnement

Copier `.env.local.example` en `.env.local` et renseigner :

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://tantpis.fr
```

Sur Vercel, les ajouter dans **Project Settings → Environment Variables**.

## Commandes

```
npm install        # installer
npm run dev        # dev server, http://localhost:3000
npm run build      # build production
npm run start      # serveur production local
npm run lint       # linter
```

## Webhook Stripe (en local)

Le webhook `/api/webhook` vérifie la signature avec `STRIPE_WEBHOOK_SECRET`. En local :

```
stripe listen --forward-to localhost:3000/api/webhook
```

Stripe CLI affichera le secret `whsec_…` à coller dans `.env.local`.

## Architecture

```
app/
├── layout.tsx                 # shell + fonts + Header/Footer/Cursor
├── page.tsx                   # homepage (5 sections éditoriales)
├── produit/[slug]/page.tsx    # page produit (galerie sticky + ATC)
├── panier/page.tsx            # panier (Zustand) + checkout
├── api/checkout/route.ts      # Stripe Checkout Session
├── api/webhook/route.ts       # webhook (signature verify)
├── commande/[id]/page.tsx     # confirmation post-paiement
├── about/page.tsx             # à propos
├── mentions-legales/page.tsx  # légal
├── icon.tsx                   # favicon dynamique
├── sitemap.ts / robots.ts     # SEO

components/                    # Header, Footer, CustomCursor, sections/...
lib/                           # products.ts, cart-store.ts, stripe.ts
public/images/                 # slots photo (cf. README dans le dossier)
```

Toutes les sections animées sont en `'use client'` ; les pages, metadata et appels Stripe restent côté serveur.

## TODO avant live

- [ ] Remplacer les placeholders dans `/public/images/` par les vraies photos (cf. `public/images/README.md`)
- [ ] Compléter `app/mentions-legales/page.tsx` avec l'éditeur réel (raison sociale, SIRET, adresse)
- [ ] Brancher le domaine `tantpis.fr` sur Vercel
- [ ] Récupérer les clés Stripe **live** + créer le webhook prod (endpoint `https://tantpis.fr/api/webhook`)
- [ ] Photos OG/twitter cards (référencer dans `app/layout.tsx`)
- [ ] Vrais avis client dans `components/sections/HomeReviews.tsx`
