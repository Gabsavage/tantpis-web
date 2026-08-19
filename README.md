# Tant Pis.

> A direct-to-consumer e-commerce site for **Tant Pis.** — Pilates grip socks for the French market. Editorial homepage, animated product pages, cart, and hosted Stripe checkout, built on Next.js 14.
>
> *Site e-commerce DTC pour la marque **Tant Pis.** — grip socks Pilates, marché français. Homepage éditoriale, pages produit animées, panier et paiement Stripe hébergé, sur Next.js 14.*

> **Personal project.** Brand-owned assets, live Stripe keys, and legal details are not included in this repo.
>
> *Projet personnel — visuels de marque, clés Stripe live et mentions légales réelles ne sont pas dans ce dépôt.*

---

## 🇬🇧 English

### Overview

A complete storefront: an editorial homepage (5 sections), a product page with a sticky gallery and add-to-cart, a persistent cart, and a full Stripe Checkout flow with post-payment confirmation — plus SEO (`sitemap`/`robots`), dynamic favicon, and legal pages.

### Engineering highlights

- **Server/client split done right.** Pages, metadata, and Stripe calls stay on the server; only the animated sections opt into `'use client'` — keeping the payment path and SEO server-rendered.
- **Verified Stripe webhooks.** `/api/webhook` validates the Stripe signature against `STRIPE_WEBHOOK_SECRET` before trusting any event — no order state changes on an unverified payload.
- **Persistent cart without a backend.** Zustand with `persist` keeps the cart across reloads client-side, so checkout stays stateless until the Stripe session is created.
- **Design-forward.** A custom cursor, Framer Motion section animations, and a CSS-variable palette give the store a distinct editorial feel rather than a template look.

### Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS + CSS variables · Framer Motion · Zustand (persist) · Stripe Checkout (hosted) · Vercel.

---

## 🇫🇷 Français

### Aperçu

Une boutique complète : homepage éditoriale (5 sections), page produit avec galerie sticky et ajout au panier, panier persistant, et flow Stripe Checkout complet avec confirmation post-paiement — plus SEO (`sitemap`/`robots`), favicon dynamique et pages légales.

### Points d'ingénierie notables

- **Découpage server/client maîtrisé.** Pages, metadata et appels Stripe restent côté serveur ; seules les sections animées passent en `'use client'` — le chemin de paiement et le SEO restent rendus côté serveur.
- **Webhooks Stripe vérifiés.** `/api/webhook` valide la signature Stripe contre `STRIPE_WEBHOOK_SECRET` avant de faire confiance à un événement — aucun changement d'état de commande sur un payload non vérifié.
- **Panier persistant sans backend.** Zustand avec `persist` conserve le panier entre les rechargements côté client ; le checkout reste stateless jusqu'à la création de la session Stripe.
- **Parti pris design.** Curseur custom, animations de sections Framer Motion et palette en variables CSS donnent à la boutique une identité éditoriale plutôt qu'un rendu template.

### Stack technique

Next.js 14 (App Router) · TypeScript · Tailwind CSS + variables CSS · Framer Motion · Zustand (persist) · Stripe Checkout (hébergé) · Vercel.

---

## Setup

### Variables d'environnement / Environment variables

Copier `.env.local.example` → `.env.local` :

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://tantpis.fr
```

Sur Vercel : **Project Settings → Environment Variables**.

### Commandes / Commands

```
npm install        # install
npm run dev        # dev server, http://localhost:3000
npm run build      # production build
npm run start      # local production server
npm run lint       # linter
```

### Webhook Stripe (local)

`/api/webhook` vérifie la signature avec `STRIPE_WEBHOOK_SECRET`. En local :

```
stripe listen --forward-to localhost:3000/api/webhook
```

La Stripe CLI affiche le secret `whsec_…` à coller dans `.env.local`.

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
├── about/ · mentions-legales/ # à propos · légal
├── icon.tsx                   # favicon dynamique
└── sitemap.ts · robots.ts     # SEO

components/                    # Header, Footer, CustomCursor, sections/...
lib/                           # products.ts, cart-store.ts, stripe.ts
public/images/                 # slots photo (cf. README dans le dossier)
```

## TODO avant live / before going live

- [ ] Remplacer les placeholders `/public/images/` par les vraies photos (cf. `public/images/README.md`)
- [ ] Compléter `app/mentions-legales/page.tsx` (raison sociale, SIRET, adresse)
- [ ] Brancher le domaine `tantpis.fr` sur Vercel
- [ ] Clés Stripe **live** + webhook prod (`https://tantpis.fr/api/webhook`)
- [ ] Images OG / Twitter cards dans `app/layout.tsx`
- [ ] Vrais avis client dans `components/sections/HomeReviews.tsx`

---

*Repository maintained by [Gabriel Savean](https://github.com/Gabsavage).*
