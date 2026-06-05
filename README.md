# PLAYERS2PAY — Trading Platform

A payment processing platform for traders. Traders receive incoming payment orders, confirm them via their cards, and earn a commission per transaction.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Wouter
- **Backend**: Express.js + TypeScript + tsx
- **Database**: PostgreSQL (Replit managed)

## Project Structure

```
players2pay/
├── server/                  # Backend (Express API)
│   ├── index.ts             # Main server entry
│   ├── db.ts                # PostgreSQL pool
│   ├── db/
│   │   ├── schema/index.ts  # Table definitions
│   │   └── migrations/      # SQL migration files
│   ├── routes/              # Route handlers
│   │   ├── auth.ts
│   │   ├── cards.ts
│   │   ├── orders.ts
│   │   ├── traders.ts
│   │   ├── stats.ts
│   │   ├── apiKeys.ts
│   │   ├── auditLogs.ts
│   │   └── mobile.ts
│   ├── middlewares/
│   │   └── requireTraderToken.ts
│   ├── services/
│   │   ├── cardSelector.ts
│   │   └── telegramNotifier.ts
│   └── lib/
│       └── logger.ts
│
├── src/                     # Frontend (React)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── auth.ts          # Auth helpers
│   ├── components/
│   │   ├── AppLayout.tsx    # Sidebar + layout
│   │   ├── AddCardModal.tsx
│   │   ├── ActiveOrdersTable.tsx
│   │   ├── TopNav.tsx
│   │   ├── TrafficToggle.tsx
│   │   └── EmptyState.tsx
│   └── pages/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── MyCards.tsx
│       ├── History.tsx
│       ├── Support.tsx
│       ├── FAQ.tsx
│       ├── Profile.tsx
│       ├── ApiKeys.tsx
│       ├── Security.tsx
│       ├── AuditLogs.tsx
│       ├── Reports.tsx
│       ├── Exchange.tsx
│       ├── Wallet.tsx
│       ├── Settings.tsx
│       └── admin/
│           ├── AdminLogin.tsx
│           └── AdminDashboard.tsx
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── drizzle.config.ts
└── .env.example
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Run database migrations
```bash
# Apply the initial migration
psql $DATABASE_URL -f server/db/migrations/001_initial.sql
```

### 4. Seed initial admin
```sql
INSERT INTO admins (name, token) VALUES ('Admin', 'admin_secret_2024');
```

### 5. Start development
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run dev
```

## Credentials (development)

| Role    | Token                  | URL              |
|---------|------------------------|------------------|
| Trader  | `tr_demo1234567890`    | `/`              |
| Admin   | `admin_secret_2024`    | `/admin`         |

## API Endpoints

### Auth
- `POST /api/auth/trader-login` — trader login

### Traders
- `GET  /api/traders/:id/stats`
- `GET  /api/traders/:id/traffic-status`
- `POST /api/traders/:id/traffic-toggle`
- `GET  /api/traders/:id/active-orders`
- `GET  /api/traders/:id/history`
- `GET  /api/traders/:id/cards`
- `POST /api/traders/cards`
- `DELETE /api/traders/cards/:cardId`

### Orders (Webhook)
- `POST /api/orders/create` — create order (called by payment processor)
- `POST /api/orders/:orderId/confirm`
- `POST /api/orders/:orderId/reject`

### Admin
- `POST /api/admin/login`
- `GET  /api/admin/traders`
- `POST /api/admin/traders`
- `POST /api/admin/traders/:id/toggle`
- `GET  /api/admin/orders`
- `GET  /api/admin/stats`

### Mobile
- `GET /api/mobile/me` — trader profile (token in header)
- `GET /api/mobile/orders` — active orders (token in header)

## Telegram Notifications

Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` to receive notifications for new orders, confirmations, and rejections.
