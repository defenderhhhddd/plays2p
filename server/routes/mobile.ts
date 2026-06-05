import { Router } from "express";
import { pool } from "../db";
import { requireTraderToken } from "../middlewares/requireTraderToken";

const router = Router();

// All mobile routes require a valid trader token header
router.use(requireTraderToken);

// GET /api/mobile/me
router.get("/me", async (req, res) => {
  const trader = (req as any).trader;
  const result = await pool.query(
    `SELECT
       t.id, t.name, t.profit_percent, t.balance, t.is_active,
       COALESCE(SUM(o.amount) FILTER (WHERE o.created_at >= CURRENT_DATE), 0) AS today_volume,
       COALESCE(SUM(o.profit) FILTER (WHERE o.created_at >= CURRENT_DATE), 0) AS today_profit
     FROM traders t
     LEFT JOIN orders o ON o.trader_id = t.id
     WHERE t.id = $1
     GROUP BY t.id`,
    [trader.id]
  );
  res.json(result.rows[0]);
});

// GET /api/mobile/orders
router.get("/orders", async (req, res) => {
  const trader = (req as any).trader;
  const result = await pool.query(
    `SELECT o.*, RIGHT(c.card_number, 4) AS card_last4, c.bank_name AS card_bank
     FROM orders o
     LEFT JOIN cards c ON o.card_id = c.id
     WHERE o.trader_id = $1 AND o.status = 'pending'
     ORDER BY o.created_at DESC`,
    [trader.id]
  );
  res.json(result.rows);
});

export default router;
