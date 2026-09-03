# lumenflow-frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4)](https://tailwindcss.com/)

> Next.js dApp for LumenFlow — empowering open-source maintainers to stream rewards, track milestone cliffs, and disburse continuous payouts to contributors on Stellar Soroban.

---

## Key Features

- **Issue Memo & Title**: Tag every payment stream with the GitHub Issue number or milestone.
- **Milestone Review Cliffs**: Option to lock funds behind review periods before contributor withdrawals unlock.
- **Maintainer Runway Top-Ups**: Add more deposit to active contributor streams without creating a new contract.
- **Contributor Wallet Rotation**: Contributors can rotate their receiving address safely.
- **On-Chain Audit Ledger**: Full table of all past transactions (creation, withdrawals, top-ups) with direct Stellar Expert explorer links.
- **Portfolio & Accounting CSV Export**: One-click download of all streaming activity for maintainer grants and community reporting.
- **Real-Time Client-Side Balance**: Computes stream balance dynamically every second without polling RPC.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page tailored for open-source maintainers and contributors |
| `/dashboard` | Maintainer & Contributor portfolio overview, search, status filters, and CSV export |
| `/streams/create` | Stream builder with issue memo, token selector (XLM/USDC), and milestone cliff toggle |
| `/streams/[id]` | Stream detail view with real-time balance hero, top-up modal, wallet rotation, and on-chain audit ledger |

---

## Getting started

```bash
pnpm install
pnpm build
pnpm dev
```
