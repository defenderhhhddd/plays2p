import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/traders/:id/stats
router.get("/:id/stats", async (req, res) => {
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

// GET /api/traders/:id/traffic-status
router.get("/:id/traffic-status", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const result = await pool.query("SELECT is_active FROM traders WHERE id = $1", [traderId]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found" });
  res.json({ enabled: result.rows[0].is_active });
});

// POST /api/traders/:id/traffic-toggle
router.post("/:id/traffic-toggle", async (req, res) => {
  const traderId = parseInt(req.params.id);
  const { enabled } = req.body;
  await pool.query("UPDATE traders SET is_active = $1 WHERE id = $2", [enabled, traderId]);
  res.json({ enabled });
});

export default router;
