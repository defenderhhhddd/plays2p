import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/traders/:id/api-keys
router.get("/:traderId/api-keys", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
  const result = await pool.query(
    "SELECT id, token, created_at FROM traders WHERE id = $1",
    [traderId]
  );
  if (!result.rows.length) return res.status(404).json({ error: "Trader not found" });
  res.json({ token: result.rows[0].token, createdAt: result.rows[0].created_at });
});

// POST /api/traders/:id/api-keys/rotate  — regenerate token
router.post("/:traderId/api-keys/rotate", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
  const newToken = "tr_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  await pool.query("UPDATE traders SET token = $1 WHERE id = $2", [newToken, traderId]);
  res.json({ token: newToken });
});

export default router;
