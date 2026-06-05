import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // 1. Проверяем сессию (после логина + 2FA)
  const sessionToken = req.headers["x-session-token"] as string || req.cookies?.sessionToken;
  
  if (sessionToken) {
    const sessionResult = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, s.expires_at 
       FROM user_sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [sessionToken]
    );
    
    if (sessionResult.rows.length > 0) {
      const user = sessionResult.rows[0];
      if (!user.is_active) {
        return res.status(403).json({ error: "Account is blocked" });
      }
      (req as any).user = user;
      (req as any).role = user.role;
      (req as any).userId = user.id;
      return next();
    }
  }
  
  // 2. Проверяем токен трейдера (для обратной совместимости)
  const traderToken = (req.headers["x-trader-token"] as string) || 
                      req.headers.authorization?.replace("Bearer ", "");
  
  if (traderToken) {
    const traderResult = await pool.query(
      `SELECT t.id, t.name, t.is_active, 'trader' as role, t.user_id
       FROM traders t
       WHERE t.token = $1`,
      [traderToken]
    );
    
    if (traderResult.rows.length > 0) {
      const trader = traderResult.rows[0];
      if (!trader.is_active) {
        return res.status(403).json({ error: "Trader account is blocked" });
      }
      (req as any).user = trader;
      (req as any).role = 'trader';
      (req as any).userId = trader.user_id || trader.id;
      (req as any).traderId = trader.id;
      return next();
    }
  }
  
  // 3. Нет авторизации
  return res.status(401).json({ error: "Authentication required" });
}

// Для обратной совместимости (чтобы старый код не сломался)
export const requireTraderToken = requireAuth;
