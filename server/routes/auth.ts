import { Router } from "express";
import { pool } from "../db";

const router = Router();

// POST /api/auth/trader-login
router.post("/trader-login", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });

  const result = await pool.query(
    "SELECT id, name, is_active FROM traders WHERE token = $1",
    [token]
  );

  if (result.rows.length === 0) return res.status(401).json({ error: "Invalid token" });

  const trader = result.rows[0];
  if (!trader.is_active) return res.status(403).json({ error: "Account is blocked" });

  return res.json({ traderId: trader.id, traderName: trader.name });
});

// POST /api/admin/login  (kept here for reference, also in admin routes)
router.post("/admin-login", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });

  const result = await pool.query(
    "SELECT id, name FROM admins WHERE token = $1",
    [token]
  );

  if (result.rows.length === 0) return res.status(401).json({ error: "Invalid admin token" });

  return res.json({ adminName: result.rows[0].name });
});

export default router;
