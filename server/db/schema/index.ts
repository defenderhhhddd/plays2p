// Database schema definitions (PostgreSQL via pg driver)
// Tables are created via server/index.ts on startup.

export const schema = {
  traders: `
    CREATE TABLE IF NOT EXISTS traders (
      id               SERIAL PRIMARY KEY,
      name             VARCHAR(255) NOT NULL,
      token            VARCHAR(255) UNIQUE NOT NULL,
      is_active        BOOLEAN DEFAULT true,
      profit_percent   NUMERIC(5,2) DEFAULT 5.00,
      balance          NUMERIC(12,2) DEFAULT 0,
      created_at       TIMESTAMP DEFAULT NOW()
    )
  `,

  cards: `
    CREATE TABLE IF NOT EXISTS cards (
      id                    SERIAL PRIMARY KEY,
      trader_id             INTEGER REFERENCES traders(id) ON DELETE CASCADE,
      card_number           VARCHAR(20) NOT NULL,
      holder_name           VARCHAR(255) NOT NULL,
      bank_name             VARCHAR(100) NOT NULL,
      min_amount            NUMERIC(12,2) DEFAULT 0,
      max_amount            NUMERIC(12,2) DEFAULT 999999,
      total_payments_limit  INTEGER DEFAULT 100,
      payments_per_minute   INTEGER DEFAULT 5,
      is_active             BOOLEAN DEFAULT true,
      created_at            TIMESTAMP DEFAULT NOW()
    )
  `,

  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      order_id        VARCHAR(100) UNIQUE NOT NULL,
      trader_id       INTEGER REFERENCES traders(id),
      card_id         INTEGER REFERENCES cards(id),
      amount          NUMERIC(12,2) NOT NULL,
      customer_name   VARCHAR(255),
      profit          NUMERIC(12,2) DEFAULT 0,
      profit_percent  NUMERIC(5,2) DEFAULT 0,
      status          VARCHAR(20) DEFAULT 'pending',
      created_at      TIMESTAMP DEFAULT NOW(),
      updated_at      TIMESTAMP DEFAULT NOW()
    )
  `,

  auditLogs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id          SERIAL PRIMARY KEY,
      trader_id   INTEGER REFERENCES traders(id),
      action      VARCHAR(100) NOT NULL,
      details     JSONB,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `,

  admins: `
    CREATE TABLE IF NOT EXISTS admins (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      token       VARCHAR(255) UNIQUE NOT NULL,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `,
};
