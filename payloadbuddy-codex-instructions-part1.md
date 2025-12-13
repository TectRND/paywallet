Below is a **single, self-contained Markdown file** you can hand directly to a **Codex AI agent**.
It is written as **implementation instructions**, starting **from scratch** and covering **everything designed in this chat**, end-to-end, up to the current point.

You can copy-paste this into `CODEX_INSTRUCTIONS.md`.

---

# Codex Instructions

## PayloadCMS 3.0 + Thirdweb Engine Web3 Wallet Platform

*(Backend-Controlled Smart Accounts, Fixed Token Deposit Tracking)*

---

## 0. Purpose of This Document

You are a **Codex AI agent** tasked with implementing a **production-grade Web3 wallet application** using:

* **Payload CMS 3.0**
* **Next.js App Router**
* **thirdweb Dedicated Engine v2**
* **Account Abstraction (ERC-4337 Smart Accounts)**
* **Backend-controlled custody by default**
* **Optional user-connected wallets (later)**
* **EVM chains**: Ethereum, BSC, Base, Arbitrum, Polygon
* **Solana backend-controlled wallets**
* **Fixed allowlist deposit tracking (USDC/USDT etc.)**

Customers **must never** access Payload Admin UI or CMS.

This document is authoritative. Implement exactly what is described unless explicitly noted as optional.

---

## 1. Core Architecture

### 1.1 Monorepo Structure

```txt
/apps/web
  /app
    /(public)
    /(account)
    /api
  /src
    /payload
    /lib
  middleware.ts
```

* Payload runs **inside Next.js**
* App Router only
* TypeScript only

---

## 2. Authentication & Access Control (Critical)

### 2.1 Two Auth Collections

You MUST implement **two separate auth collections**:

| Collection  | Purpose                                       |
| ----------- | --------------------------------------------- |
| `admins`    | Only users allowed to access Payload Admin UI |
| `customers` | App users only (wallet users)                 |

In `payload.config.ts`:

```ts
admin: {
  user: 'admins'
}
```

➡️ This **guarantees customers cannot log into `/admin`**, even if they try.

---

### 2.2 Route Protection (Next.js Middleware)

Create `middleware.ts`:

* `/admin/*` → requires admin session
* `/account/*` → requires customer session

Customers must be redirected to `/login` if unauthorized.

---

## 3. Wallet Strategy

### 3.1 EVM (Ethereum, BSC, Base, Arbitrum, Polygon)

* Use **thirdweb Dedicated Engine v2**
* Use **Account Abstraction (ERC-4337)**
* **Backend-controlled smart accounts**
* One smart account per customer
* Deterministic address via **account salt**
* Gas sponsorship enabled via Engine

Smart account identity =
`(AccountFactory + adminAddress + accountSalt)`

---

### 3.2 Solana

* Use **thirdweb Solana server wallets**
* Backend-controlled
* Wallet created at signup
* Must be funded with SOL manually

Optional later:

* user-connected Solana wallets (not default)

---

## 4. Payload Collections (Schemas)

### 4.1 Identity

#### `admins`

* `auth: true`
* role: `admin | ops | support`

#### `customers`

* `auth: true`
* role is **forced to `customer`**
* cannot modify role
* relationships:

  * `evmAccount`
  * `solWallet`

---

### 4.2 Wallets

#### `evm_smart_accounts`

* `customer`
* `smartAccountAddress`
* `salt` (`cust:<customerId>`)
* `factoryAddress`
* `adminAddress`
* `supportedChainIds`
* `custodyMode = backend`

#### `sol_server_wallets`

* `customer`
* `thirdwebWalletId`
* `publicKey`
* `network`
* `custodyMode = backend`

---

### 4.3 Transactions

Unified ledger for all activity.

Fields:

* `customer`
* `networkType: evm | solana`
* `chainId`
* `type: deposit | transfer | topup`
* `status: pending | confirmed | failed | reverted`
* `source: engine | insight`
* `idempotencyKey` (unique)
* `transactionHash`
* `logIndex`
* `blockNumber`
* `blockTimestamp`
* `confirmations`
* `confirmationsRequired`
* `from`
* `to`
* `asset`
* `amount`
* `rawWebhook`

---

### 4.4 Token Allowlist (Deposits)

#### `token_allowlist`

Admin-only.

Fields:

* `chainId`
* `symbol`
* `name`
* `contractAddress`
* `decimals`
* `confirmationsRequired`
* `isActive`

Only tokens in this table are tracked for deposits.

---

### 4.5 Indexer State

#### `indexer_state`

Admin-only.

Fields:

* `chainId`
* `lastBlockTimestamp`

Used to make deposit syncing efficient.

---

### 4.6 Engine Settings

#### `engine_settings`

Singleton.

Fields:

* `engineUrl`
* `engineAccessToken`
* `backendWalletAddress`
* `accountFactories[]` (chainId → factoryAddress)
* `rpcUrls[]` (chainId → RPC URL)

---

## 5. Smart Account Address Resolution (Deterministic)

Use **thirdweb SDK v5**:

```ts
predictSmartAccountAddress({
  client,
  chain,
  factoryAddress,
  adminAddress,
  accountSalt,
})
```

This allows:

* Instant deposit address display
* Deposits before deployment (counterfactual)

NEVER rely on Engine response for address.

---

## 6. EVM Execution via Dedicated Engine v2

### 6.1 Headers Used

| Purpose                 | Header                     |
| ----------------------- | -------------------------- |
| Backend wallet          | `x-backend-wallet-address` |
| Smart account (salt)    | `x-account-salt`           |
| Smart account (address) | `x-account-address`        |
| Atomic native tx        | `x-smart-account-address`  |

---

### 6.2 ERC-20 Transfer

Endpoint:

```txt
POST /contract/{chainId}/{token}/write
```

Payload:

```json
{
  "functionName": "transfer(address,uint256)",
  "args": ["0xRecipient", "amountWei"]
}
```

Headers:

* `x-backend-wallet-address`
* `x-account-salt`

---

### 6.3 Native Transfer

Endpoint:

```txt
POST /backend-wallet/{chainId}/send-transaction-batch-atomic
```

Payload:

```json
{
  "transactions": [
    { "toAddress": "0xRecipient", "value": "wei", "data": "0x" }
  ]
}
```

Headers:

* `x-backend-wallet-address`
* `x-smart-account-address`

---

## 7. Engine Webhooks (Outbound TXs)

* Verify HMAC signature:

  ```
  HMAC_SHA256(secret, `${timestamp}.${rawBody}`)
  ```
* Update `transactions`:

  * `sent`
  * `mined`
  * `errored`
  * `reverted`
* Webhooks may arrive out-of-order → apply **status priority**

---

## 8. Deposits (Inbound Funds)

### 8.1 Strategy

* Track **ONLY allowlisted tokens**
* Use **thirdweb Insight Events API**
* Polling cron (reliable)
* Idempotent upserts

---

### 8.2 Deposit Sync Job

Runs every 1–2 minutes.

For each:

* Chain
* Allowlisted token

Fetch:

```
Transfer(address,address,uint256)
```

Logic:

* Match `to` address to customer smart accounts
* Create `transactions`:

  * `type = deposit`
  * `status = pending`
  * `confirmations = 0`

---

### 8.3 Confirmations Job

Runs every 1–2 minutes.

For each pending deposit:

* Fetch latest block via RPC
* confirmations = `latestBlock - tx.blockNumber`
* If >= required → mark `confirmed`

---

## 9. Admin Tools

### 9.1 Token Allowlist Bulk Import

Admin-only API route.

Supports:

* Upsert mode
* Insert-only mode
* Optional deactivate missing tokens

---

### 9.2 Reindex Deposits

Admin-only.

Allows setting `indexer_state.lastBlockTimestamp` backward to resync history.

---

## 10. Customer UI

### `/account/deposits`

Server component.

Features:

* Shows deposits only
* Joins token metadata (symbol, decimals)
* Pending-only toggle
* Chain filter
* Token filter
* Confirmation progress
* Explorer links

---

## 11. Security Requirements (Non-Negotiable)

* No private keys stored in DB
* All custody via thirdweb Engine / server wallets
* Customers:

  * cannot access Admin UI
  * cannot modify roles
  * can only read/write their own data
* All webhooks:

  * signature verified
  * idempotent
* Cron routes:

  * protected by secret header

---

## 12. Deployment Notes

* Use Postgres
* Run cron jobs via:

  * Vercel cron
  * Cloud scheduler
* Monitor:

  * Engine webhook failures
  * Insight sync lag
  * Confirmation job lag

---

## 13. Future Extensions (Do NOT implement now)

* User-connected wallets
* NFT support
* Token swaps
* Solana deposits
* Insight webhooks (push instead of poll)

---

## 14. Definition of Done

The implementation is complete when:

* A customer signs up → wallets are provisioned
* Deterministic EVM address is shown immediately
* ERC-20 & native transfers work via Engine
* Deposits of allowlisted tokens are detected
* Deposits move from pending → confirmed
* Customers cannot access `/admin`
* Admins can manage tokens and reindex safely

---

**End of Codex Instructions**

---

If you want, next I can:

* split this into **tasks.json** for autonomous agent execution,
* generate a **Mermaid architecture diagram**,
* or convert this into a **PR checklist** for human review.

