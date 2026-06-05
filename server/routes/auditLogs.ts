import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/traders/:id/audit-logs
router.get("/:traderId/audit-logs", async (req, res) => {
  const traderId = parseInt(req.params.traderId);
  const result = await pool.query(
    "SELECT * FROM audit_logs WHERE trader_id = $1 ORDER BY created_at DESC LIMIT 100",
    [traderId]
  );
  res.json(result.rows);
});

// Helper — call this from other routes to write a log entry
export async function writeAuditLog(traderId: number, action: string, details?: unknown) {
  await pool.query(
    "INSERT INTO audit_logs (trader_id, action, details) VALUES ($1, $2, $3)",
    [traderId, action, details ? JSON.stringify(details) : null]
  );
}

export default router;
