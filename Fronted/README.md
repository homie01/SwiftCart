# SwiftCart — Premium E-Commerce Frontend

A full-featured, production-ready e-commerce storefront built with React + Vite + Tailwind CSS. Designed to look and feel like a premium brand store (think Apple, Zara, or ASOS).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env → set VITE_API_URL to your backend

# 3. Run dev server
npm run dev
# → http://localhost:5173
```

## Pages

| Route                            | Page                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `/`                              | Homepage — hero slider, categories, featured products, promo banner, testimonials |
| `/shop`                          | Shop — search, category filters, price range, sort, grid/list view, pagination    |
| `/product/:id`                   | Product detail — image gallery, reviews, related products, add to cart            |
| `/wishlist`                      | Saved products — move to cart, remove                                             |
| `/checkout`                      | 3-step checkout — review → shipping → payment → confirmation                      |
| `/account/orders`                | Order history with expandable details                                             |
| `/account/profile`               | Edit name, phone, manage addresses                                                |
| `/account/settings`              | Change password, account info                                                     |
| `/login`                         | Sign in with split-screen branding                                                |
| `/register`                      | Create account                                                                    |
| `/forgot-password`               | Password reset request                                                            |
| `/reset-password/:userId/:token` | Set new password                                                                  |
| `*`                              | 404 page                                                                          |

## Features

- **Hero carousel** — 3 auto-sliding banners with parallax effect
- **Sliding cart drawer** — instant add/remove/quantity update, persisted across refreshes
- **Wishlist** — heart toggle, localStorage persisted, move-to-cart
- **Product cards** — hover quick-add, wishlist toggle, discount badges
- **Search overlay** — keyboard-friendly full-screen modal with quick tags
- **Responsive** — mobile-first, works on all screen sizes
- **Animations** — Framer Motion throughout (page transitions, card enters, drawer slide)
- **Toast notifications** — top-center dark toasts for all actions
- **Protected routes** — checkout and account require login
- **Guest browsing** — shop and wishlist work without login

## Stack

- React 18 + Vite
- Tailwind CSS 3 (custom design tokens: cream/ink/amber palette)
- Zustand (auth, cart, wishlist, UI stores — all persisted)
- React Router v6
- Framer Motion
- Axios (JWT interceptors, auto-logout on 401)
- React Hot Toast
- Lucide React icons
- Google Fonts: Outfit + Playfair Display

## Backend API

Connects to your Express backend at `VITE_API_URL`. All API calls are in `src/api/index.js`.

JWT is stored in `localStorage` as `sw_token` and sent as `Authorization: Bearer <token>` on every request.

## Design System

Custom color palette in `tailwind.config.js`:

- `ink` — #0a0a0a (near-black for text, buttons)
- `cream` — #faf8f5 (warm off-white backgrounds)
- `amber` — #d4a853 (gold accent, CTAs)

Custom component classes in `src/index.css`:

- `.btn-dark`, `.btn-outline`, `.btn-amber`, `.btn-ghost`
- `.input-field`, `.product-card`, `.glass-nav`
- `.section-label`, `.section-title`, `.skeleton`
