import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/stats/platform  — admin-level platform overview
router.get("/platform", async (_req, res) => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM traders) AS total_traders,
      (SELECT COUNT(*) FROM traders WHERE is_active = true) AS active_traders,
      (SELECT COUNT(*) FROM cards WHERE is_active = true) AS active_cards,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS today_volume,
      COALESCE(SUM(profit) FILTER (WHERE created_at >= CURRENT_DATE), 0) AS today_profit,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today_orders,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders
    FROM orders
  `);
  res.json(result.rows[0]);
});

export default router;
