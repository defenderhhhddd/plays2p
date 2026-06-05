import express from "express";
import cors from "cors";
import { pool } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

// ─── Auth ───────────────────────────────────────────────────────────────────

app.post("/api/auth/trader-login", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });

  const result = await pool.query(
    "SELECT id, name, is_active FROM traders WHERE token = $1",
    [token]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const trader = result.rows[0];
  if (!trader.is_active) {
    return res.status(403).json({ error: "Account is blocked" });
  }

  return res.json({ traderId: trader.id, traderName: trader.name });
});

// ─── Traders ─────────────────────────────────────────────────────────────────

app.get("/api/traders/:id/active-orders", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query(
    `SELECT o.id, o.order_id, o.amount, o.customer_name, o.profit, o.profit_percent, o.status,
            COALESCE(RIGHT(c.card_number, 4), '0000') AS card_last4,
            COALESCE(c.bank_name, 'Unknown') AS card_bank
     FROM orders o
     LEFT JOIN cards c ON o.card_id = c.id
     WHERE o.trader_id = $1 AND o.status = 'pending'
     ORDER BY o.created_at DESC`,
    [traderId]
  );
  res.json(result.rows);
});

app.get("/api/traders/:id/stats", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS today_volume,
       COALESCE(SUM(profit) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS today_profit,
       COALESCE(COUNT(*) FILTER (WHERE status = 'confirmed' AND created_at >= CURRENT_DATE), 0) AS today_count,
       (SELECT balance FROM traders WHERE id = $1) AS balance,
       (SELECT is_active FROM traders WHERE id = $1) AS is_active
     FROM orders
     WHERE trader_id = $1`,
    [traderId]
  );
  res.json(result.rows[0]);
});

app.get("/api/traders/:id/traffic-status", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT is_active FROM traders WHERE id = $1",
    [traderId]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json({ enabled: result.rows[0].is_active });
});

app.post("/api/traders/:id/traffic-toggle", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const { enabled } = req.body;
  await pool.query(
    "UPDATE traders SET is_active = $1 WHERE id = $2",
    [enabled, traderId]
  );
  res.json({ enabled });
});

// ─── Cards ───────────────────────────────────────────────────────────────────

app.get("/api/traders/:id/cards", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT * FROM cards WHERE trader_id = $1 ORDER BY created_at DESC",
    [traderId]
  );
  res.json(result.rows);
});

app.post("/api/traders/cards", async (req, res) => {
  const { traderId, cardNumber, holderName, bankName, minAmount, maxAmount, totalPaymentsLimit, paymentsPerMinute } = req.body;
  const result = await pool.query(
    `INSERT INTO cards (trader_id, card_number, holder_name, bank_name, min_amount, max_amount, total_payments_limit, payments_per_minute)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [traderId, cardNumber, holderName, bankName, minAmount, maxAmount, totalPaymentsLimit, paymentsPerMinute]
  );
  res.status(201).json(result.rows[0]);
});

app.delete("/api/traders/cards/:cardId", async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  await pool.query("UPDATE cards SET is_active = false WHERE id = $1", [cardId]);
  res.json({ success: true });
});

// ─── History ─────────────────────────────────────────────────────────────────

app.get("/api/traders/:id/history", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query(
    `SELECT o.id, o.order_id, o.amount, o.customer_name, o.profit, o.profit_percent, o.status, o.created_at,
            COALESCE(RIGHT(c.card_number, 4), '0000') AS card_last4,
            COALESCE(c.bank_name, 'Unknown') AS card_bank
     FROM orders o
     LEFT JOIN cards c ON o.card_id = c.id
     WHERE o.trader_id = $1 AND o.status != 'pending'
     ORDER BY o.created_at DESC
     LIMIT 100`,
    [traderId]
  );
  res.json(result.rows);
});

// ─── Admin middleware ────────────────────────────────────────────────────────

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers["x-admin-token"] as string;
  if (!token) return res.status(401).json({ error: "Admin token required" });
  const result = await pool.query("SELECT id FROM admins WHERE token = $1", [token]);
  if (result.rows.length === 0) return res.status(403).json({ error: "Invalid admin token" });
  next();
}

// ─── Admin Auth ──────────────────────────────────────────────────────────────

app.post("/api/admin/login", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });
  const result = await pool.query("SELECT id, name FROM admins WHERE token = $1", [token]);
  if (result.rows.length === 0) return res.status(401).json({ error: "Invalid admin token" });
  res.json({ adminName: result.rows[0].name });
});

// ─── Admin: Stats ────────────────────────────────────────────────────────────

app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM traders) AS total_traders,
      (SELECT COUNT(*) FROM traders WHERE is_active = true) AS active_traders,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS today_volume,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today_orders
    FROM orders
  `);
  res.json(result.rows[0]);
});

// ─── Admin: Traders ──────────────────────────────────────────────────────────

app.get("/api/admin/traders", requireAdmin, async (_req, res) => {
  const result = await pool.query(`
    SELECT
      t.id, t.name, t.token, t.is_active, t.profit_percent, t.balance, t.created_at,
      COUNT(o.id) AS order_count,
      COALESCE(SUM(o.amount) FILTER (WHERE o.created_at >= CURRENT_DATE), 0) AS today_volume
    FROM traders t
    LEFT JOIN orders o ON o.trader_id = t.id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
  res.json(result.rows);
});

app.post("/api/admin/traders", requireAdmin, async (req, res) => {
  const { name, profit_percent } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const token = "tr_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const result = await pool.query(
    "INSERT INTO traders (name, token, profit_percent) VALUES ($1, $2, $3) RETURNING *",
    [name, token, profit_percent ?? 5]
  );
  res.status(201).json(result.rows[0]);
});

app.post("/api/admin/traders/:id/toggle", requireAdmin, async (req, res) => {
  const traderId = parseInt(req.params.id);
  const { is_active } = req.body;
  await pool.query("UPDATE traders SET is_active = $1 WHERE id = $2", [is_active, traderId]);
  res.json({ success: true });
});

// ─── Admin: All active orders ────────────────────────────────────────────────

app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  const result = await pool.query(`
    SELECT
      o.id, o.order_id, o.amount, o.customer_name, o.status, o.created_at,
      t.name AS trader_name,
      COALESCE(RIGHT(c.card_number, 4), '0000') AS card_last4,
      COALESCE(c.bank_name, 'Unknown') AS card_bank
    FROM orders o
    JOIN traders t ON o.trader_id = t.id
    LEFT JOIN cards c ON o.card_id = c.id
    WHERE o.status = 'pending'
    ORDER BY o.created_at DESC
  `);
  res.json(result.rows);
});

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
