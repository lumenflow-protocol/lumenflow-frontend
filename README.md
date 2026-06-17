# lumenflow-frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4)](https://tailwindcss.com/)

> Next.js dApp for LumenFlow — create payment streams, track live balances, and manage withdrawals on Stellar.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, how-it-works |
| `/dashboard` | Your sending and receiving streams with live balance countdown |
| `/streams/create` | Create a new payment stream |
| `/streams/[id]` | Stream detail — balance hero, withdraw, pause, cancel, resume |

---

## Project structure

```
components/
├── atoms/
│   ├── badge/          — StreamStatus badge (Active, Paused, Cancelled, Completed)
│   ├── button/         — Base button
│   ├── card/           — Base card
│   ├── connect-button/ — Freighter wallet connect
│   └── loading/        — Spinner
├── molecules/
│   ├── StreamCard/         — Stream summary card with live balance bar
│   ├── StreamDetail/       — Full stream view with action buttons
│   ├── CreateStreamForm/   — Form to create a stream
│   └── transaction-modal/  — Tx pending / success / error modal
└── organisms/
    ├── navbar/         — Top navigation with wallet connect
    └── StreamList/     — Responsive grid of StreamCards

hooks/
├── useWallet.ts          — Freighter connect + sign
├── useStream.ts          — Fetch stream(s) from backend API
├── useStreamBalance.ts   — Real-time balance computed client-side every second
├── useIsMounted.ts       — SSR-safe mount check
└── useToast.ts           — Toast notification state

lib/
├── contract.ts     — Soroban contract invocation (all 5 functions)
├── api.ts          — Backend REST client
└── constants.ts    — Env var config
```

---

## Design

- **Colors:** Violet (`#8B5CF6`) + Cyan (`#06B6D4`) on near-black (`#08090e`)
- **Buttons:** Gradient `violet → cyan` with glow shadow
- **Cards:** Dark glass with subtle border and hover lift
- **Balance:** Updates every second client-side using rate × elapsed calculation — no blockchain call needed

---

## Getting started

### Prerequisites

- Node.js >= 18 + pnpm
- [Freighter](https://freighter.app) browser extension
- A running `lumenflow-backend` instance

### Setup

```bash
pnpm install
cp .env.example .env.local    # fill in contract ID and API URL
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_STREAM_CONTRACT_ID` | Deployed stream contract address | — |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_NETWORK` | `testnet` or `mainnet` | `testnet` |
| `NEXT_PUBLIC_USDC_CONTRACT_ID` | USDC contract ID (optional) | — |

### Build for production

```bash
pnpm build
pnpm start
```

---

## How the balance counter works

The frontend computes the withdrawable balance **client-side** every second without polling the blockchain:

```
now           = current unix timestamp
effective_end = min(now, stop_time)
elapsed       = effective_end - start_time  (+ banked seconds if previously paused)
streamed      = min(elapsed × rate_per_second, deposit)
available     = streamed - withdrawn
```

This gives a smooth, real-time counter at zero blockchain cost.

---

## Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md).

## License

MIT License — Copyright (c) 2026 LumenFlow Protocol.
