import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/traders/:id/cards
router.get("/:traderId/cards", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
  const result = await pool.query(
    "SELECT * FROM cards WHERE trader_id = $1 ORDER BY created_at DESC",
    [traderId]
  );
  res.json(result.rows);
});

// POST /api/traders/cards
router.post("/", async (req, res) => {
  const { traderId, cardNumber, holderName, bankName, minAmount, maxAmount, totalPaymentsLimit, paymentsPerMinute } = req.body;
  const result = await pool.query(
    `INSERT INTO cards (trader_id, card_number, holder_name, bank_name, min_amount, max_amount, total_payments_limit, payments_per_minute)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [traderId, cardNumber, holderName, bankName, minAmount, maxAmount, totalPaymentsLimit, paymentsPerMinute]
  );
  res.status(201).json(result.rows[0]);
});

// DELETE /api/traders/cards/:cardId
router.delete("/:cardId", async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  await pool.query("UPDATE cards SET is_active = false WHERE id = $1", [cardId]);
  res.json({ success: true });
});

export default router;
