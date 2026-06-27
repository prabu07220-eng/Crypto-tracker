# BlueLight — Crypto Tracker

A light, 3D/neumorphic crypto market tracker. React + TypeScript + Vite, with a multi-page dashboard, coin detail charts, a simulated portfolio, and persisted settings — built against the CoinGecko public API.

## Pages

- **Dashboard** — global market stats (market cap, 24h volume, BTC dominance, active coins), a searchable/sortable coin table with 7-day sparklines, and Watchlist / Gainers / Losers filters.
- **Coin Detail** (`/coin/:id`) — price chart with 1D / 7D / 1M / 1Y timeframes, watchlist toggle, quick USD/INR convert, and extended stats (ATH, supply, 24h high/low).
- **Portfolio** — simulated holdings (coin, quantity, buy price) with live P&L, an allocation pie chart, and a total value/P&L summary. Stored locally — no backend, no real funds.
- **Settings** — light/dark theme, currency, refresh interval, and one-tap clearing of watchlist/portfolio data.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · TanStack Query · Zustand (with `persist`) · Framer Motion · Recharts · Axios · Lucide icons · CoinGecko API (`/coins/markets`, `/coins/{id}/market_chart`, `/global`)

## Getting started

```bash
npm install
npm run dev
```

No API key required — this uses CoinGecko's free public endpoint.

```bash
npm run build      # type-checks with tsc, then builds to dist/
npm run preview    # preview the production build locally
npm run lint        # ESLint
```

## Design & engineering decisions

- **Theming via CSS variables, not class duplication.** Light/dark mode is driven by a small set of CSS custom properties (`--c-surface`, `--c-ink`, etc.) that Tailwind's color tokens read through `rgb(var(--x) / <alpha-value>)`. Toggling the `.dark` class on `<html>` re-points those variables once, so every component using `text-ink`, `bg-surface`, `neu-card`, and so on updates automatically — no per-component dark: classes needed.
- **Real INR data, not client-side conversion.** Switching currency re-queries CoinGecko with `vs_currency=inr` instead of multiplying USD prices by a hardcoded exchange rate, so figures stay accurate.
- **Lightweight inline sparklines.** Each table row draws its own 7-day trend as a small hand-written SVG polyline rather than mounting a full Recharts instance per row — Recharts is reserved for the single Coin Detail chart, where tooltips and axes are actually used.
- **Route-based code-splitting.** Each page is loaded with `React.lazy`, so Vite ships a separate chunk per route (Dashboard, Coin Detail, Portfolio, Settings) — visible in the build output — keeping the initial load smaller.
- **No backend.** Watchlist, portfolio holdings, and settings are persisted via Zustand's `persist` middleware to `localStorage`. The portfolio is explicitly a simulation; there's no real account or funds involved.
- **Accessibility basics covered:** semantic labels on all interactive controls (`aria-label`, `aria-pressed`), visible focus rings, and reduced-motion handling for both Framer Motion and the shimmer/skeleton animations.

## Known trade-offs / what's not included

- **No WebSocket live ticks** — the brief marks this as a later/optional enhancement; this build polls on a user-configurable interval (15s–60s) instead.
- **No news feed** on the Coin Detail page — marked optional in the brief, skipped to keep the scope focused on the core tracker.
- **No automated Lighthouse run** — this environment can't launch a browser to audit itself. Run Lighthouse against the deployed build (or `npm run preview` locally) to verify the time-to-interactive target.
- **No authentication** — out of scope for a frontend-only internship project; portfolio data is local to the browser it was entered in.

## Deployment

Push to GitHub and import the repo into Vercel or Netlify — no environment variables are required. Build command: `npm run build`. Output directory: `dist`.

## Attribution

Market data and coin logos courtesy of [CoinGecko](https://www.coingecko.com/en/api).
