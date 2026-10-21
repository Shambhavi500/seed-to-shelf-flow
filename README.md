# AgriChain: Seed to Shelf

Blockchain-based supply-chain tracking for agricultural produce. AgriChain follows a batch from the farmer who grew it, through the distributor and retailer, to the consumer who buys it, and records every hand-off as a tamper-proof transaction.

Built for the Smart India Hackathon (SIH).

## The problem

Once produce leaves the farm, its origin, quality grade and price history are hard to trace. Farmers rarely see what their crop finally sells for, and consumers have no way to check where it came from. AgriChain puts each step on a shared ledger, so anyone in the chain can verify the record.

## Features

- **Role-based dashboards.** Switch between Farmer, Distributor, Retailer and Consumer views.
- **Product registration.** Farmers register a batch with its quantity, base price, harvest date, quality grade (A/B/C) and location.
- **Supply-chain updates.** Distributors and retailers take over a batch, update its price and move it along the chain.
- **Verification.** Consumers look up a product and see its full transaction history and current status.
- **Transaction details.** Every step shows its transaction hash, block number and gas used.

## How it works

```
Farmer ── registers batch ──▶ Distributor ── updates price ──▶ Retailer ── sells ──▶ Consumer
   │                             │                               │                     │
   └──────────── each step is written as a transaction on the ledger ──────────────────┘
                                                                         verify history ◀┘
```

The repository has two parts:

| Part | What it is |
|---|---|
| `src/` | React web app with the dashboards and verification flow. For the demo it runs on an in-browser blockchain simulator (`src/utils/blockchain.ts`) that comes with sample data, so no wallet or network is needed. |
| `smart-contracts/` | `AgriChain.sol`, a Solidity contract for the same flow (register, distributor and retailer updates, delivery, verification) with a Hardhat setup for local and Sepolia deployment. |

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), React Router, TanStack Query
- **Smart contracts:** Solidity, Hardhat, ethers.js

## Run it locally

You need Node.js 18 or later.

```bash
git clone https://github.com/Shambhavi500/seed-to-shelf-flow.git
cd seed-to-shelf-flow
npm install
npm run dev
```

The app opens at http://localhost:8080.

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |

For the contracts, see [smart-contracts/README.md](smart-contracts/README.md).

## Project structure

```
src/
  components/     Header, ProductCard, StakeholderDashboard, SupplyChainFlow,
                  TransactionModal, VerificationModal, ui/ (shadcn components)
  pages/          Index (main app), NotFound
  utils/          blockchain.ts (ledger simulator and sample data)
smart-contracts/  AgriChain.sol, deploy.js, hardhat.config.js
public/           favicon, robots.txt
```
