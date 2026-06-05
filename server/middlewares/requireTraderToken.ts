import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export async function requireTraderToken(req: Request, res: Response, next: NextFunction) {
  const token =
    (req.headers["x-trader-token"] as string) ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Trader token required" });
  }

  const result = await pool.query(
    "SELECT id, name, is_active FROM traders WHERE token = $1",
    [token]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid trader token" });
  }

  const trader = result.rows[0];
  if (!trader.is_active) {
    return res.status(403).json({ error: "Trader account is blocked" });
  }

  (req as any).trader = trader;
  next();
}
