import { Router } from "express";
import { pool } from "../db";
import { selectCard } from "../services/cardSelector";
import { telegramNotifier } from "../services/telegramNotifier";

const router = Router();

// GET /api/traders/:id/active-orders
router.get("/:traderId/active-orders", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
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

// GET /api/traders/:id/history
router.get("/:traderId/history", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
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

// POST /api/orders/create  (called by payment processor webhook)
router.post("/create", async (req, res) => {
  const { amount, customerName } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount required" });

  const card = await selectCard(Number(amount));
  if (!card) return res.status(503).json({ error: "No available cards for this amount" });

  const traderResult = await pool.query(
    "SELECT profit_percent FROM traders WHERE id = $1",
    [card.trader_id]
  );
  const profitPercent = traderResult.rows[0]?.profit_percent ?? 5;
  const profit = (Number(amount) * profitPercent) / 100;

  const orderId = "ord_" + Date.now() + Math.random().toString(36).slice(2, 7);

  const result = await pool.query(
    `INSERT INTO orders (order_id, trader_id, card_id, amount, customer_name, profit, profit_percent)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [orderId, card.trader_id, card.id, amount, customerName ?? null, profit, profitPercent]
  );

  const traderResult2 = await pool.query("SELECT name FROM traders WHERE id = $1", [card.trader_id]);
  await telegramNotifier.newOrder(orderId, Number(amount), traderResult2.rows[0]?.name ?? "Unknown");

  res.status(201).json({
    orderId,
    cardNumber: card.card_number,
    bankName: card.bank_name,
    amount,
  });
});

// POST /api/orders/:orderId/confirm
router.post("/:orderId/confirm", async (req, res) => {
  const { orderId } = req.params;
  const result = await pool.query(
    "UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE order_id = $1 RETURNING *",
    [orderId]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
  const order = result.rows[0];
  await telegramNotifier.orderConfirmed(orderId, order.amount, order.profit);
  res.json({ success: true });
});

// POST /api/orders/:orderId/reject
router.post("/:orderId/reject", async (req, res) => {
  const { orderId } = req.params;
  await pool.query(
    "UPDATE orders SET status = 'rejected', updated_at = NOW() WHERE order_id = $1",
    [orderId]
  );
  await telegramNotifier.orderRejected(orderId);
  res.json({ success: true });
});

export default router;
