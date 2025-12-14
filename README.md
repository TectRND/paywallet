# PayWallet

Backend-controlled smart account wallet platform built with Next.js App Router, Payload CMS 3, and thirdweb Engine. The app provisions deterministic EVM smart accounts and server-controlled Solana wallets, tracks allowlisted token deposits with confirmation progress, and separates admin/customer access with middleware-enforced routing.

## Monorepo layout

```
/apps/web     # Next.js + Payload CMS application
```

Key app folders:

- `app/(public)`: Public-facing routes, including the landing page.
- `app/(account)`: Customer portal pages such as `/account` and `/account/deposits`.
- `app/api`: API endpoints (e.g., `/api/health`).
- `middleware.ts`: Route guards for admin and customer areas.
- `src/payload`: Payload config, collections, and globals.

## Features

- Dual auth collections: `admins` (for Payload Admin UI) and `customers` (wallet users) with middleware protection for `/admin/*` and `/account/*` routes.
- Wallet records for deterministic EVM smart accounts (`evm_smart_accounts`) and backend-controlled Solana wallets (`sol_server_wallets`).
- Unified `transactions` ledger for deposits and outbound activity with status tracking.
- Admin-only controls for token allowlists (`token_allowlist`), indexer cursor (`indexer_state`), and engine connectivity settings (`engine_settings`).
- Health endpoint at `/api/health` for uptime checks.

## Requirements

- Node.js 18+ (Next.js 14) and npm.
- Postgres database for Payload (`DATABASE_URL`).
- Payload secret for session signing (`PAYLOAD_SECRET`).
- Public server URL for Payload/Next (`NEXT_PUBLIC_SERVER_URL`, defaults to `http://localhost:3000`).

## Getting started

1. Install dependencies from the repo root:
   ```bash
   npm install
   ```
2. Configure environment variables (example):
   ```bash
   export DATABASE_URL="postgres://postgres:postgres@localhost:5432/payload"
   export PAYLOAD_SECRET="changeme-secret"
   export NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
   ```
3. Run the development server:
   ```bash
   npm run dev --workspace apps/web
   ```
   The app will start on port 3000 by default.

## Building for production

```bash
npm run build --workspace apps/web
```

Use `npm run start --workspace apps/web` to serve the production build.

## Notes

- Customers cannot access the Payload Admin UI; only `admins` collection accounts can log in to `/admin`.
- The landing page is dynamic to avoid static pre-rendering issues during deployment.
- Adjust Payload database pool or URL as needed via `DATABASE_URL`.
