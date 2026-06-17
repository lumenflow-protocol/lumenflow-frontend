# Contributing to lumenflow-frontend

This repo contains the Next.js dApp for LumenFlow — the interface for creating streams, viewing live balances, and managing withdrawals on Stellar.

---

## Prerequisites

- Node.js >= 18
- pnpm (`npm install -g pnpm`)
- [Freighter](https://freighter.app) browser extension for wallet testing
- A running `lumenflow-backend` instance (for API calls)

---

## Development workflow

```bash
# Clone
git clone https://github.com/lumenflow-protocol/lumenflow-frontend.git
cd lumenflow-frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_STREAM_CONTRACT_ID and NEXT_PUBLIC_API_URL

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser with Freighter installed.

---

## Where things live

```
components/
├── atoms/          — smallest reusable pieces (Badge, Button, ConnectButton)
├── molecules/      — composed components (StreamCard, StreamDetail, CreateStreamForm)
└── organisms/      — page-level sections (Navbar, StreamList)

hooks/              — React hooks (useWallet, useStream, useStreamBalance)
lib/                — non-React utilities (contract.ts, api.ts, constants.ts)
pages/              — Next.js routes
styles/             — globals.css (Tailwind base + custom utilities)
```

---

## Design system

| Token | Value | Usage |
|---|---|---|
| Brand violet | `#8B5CF6` | Primary actions, gradients |
| Accent cyan | `#06B6D4` | Gradient endpoint, accents |
| Background | `#08090e` | Page background |
| Surface | `#0f1117` | Cards and panels |

- Buttons use `bg-gradient-to-r from-violet-600 to-cyan-500`
- All new UI must work in the dark theme (light theme not supported)
- Follow the atoms → molecules → organisms hierarchy for new components

---

## Adding a new page

1. Create `pages/<route>.tsx`
2. Wrap content in the shared layout (navbar is in `_app.tsx`)
3. Add the route to the navbar links in `components/organisms/navbar/index.tsx` if needed
4. Run `pnpm build` — must pass before opening a PR

---

## Adding a new component

1. Create a folder under the correct level (`atoms/`, `molecules/`, or `organisms/`)
2. Export from the folder's `index.tsx`
3. Add the export to the barrel `components/<level>/index.tsx`

---

## Branch naming

```
feat/stream-history-page
fix/balance-flicker-on-pause
ui/dashboard-empty-state
docs/hook-jsdoc
```

---

## Commit format

```
feat: add stream history page
fix: prevent balance flash on stream pause
ui: improve dashboard empty state design
chore: upgrade next to v14.1
```

---

## Opening a PR

- Target branch: `main`
- `pnpm build` must pass with zero TypeScript errors
- Include screenshots for any UI changes
- Test with Freighter connected on Stellar testnet if touching wallet/contract code

---

For questions, open a GitHub Issue or Discussion.
