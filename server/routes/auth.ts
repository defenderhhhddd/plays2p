import { Router } from "express";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { pool } from "../db";
import crypto from "crypto";

const router = Router();

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Логин: email, пароль, токен
router.post("/login", async (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password || !token) {
    return res.status(400).json({ error: "Email, password and token are required" });
  }

  // 1. Проверяем пользователя
  const userResult = await pool.query(
    "SELECT id, email, password_hash, role, two_factor_secret, is_active FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rows.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = userResult.rows[0];

  if (!user.is_active) {
    return res.status(403).json({ error: "Account is blocked" });
  }

  // 2. Проверяем пароль
  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 3. Проверяем токен в зависимости от роли
  let tokenValid = false;

  if (user.role === "trader") {
    const traderResult = await pool.query(
      "SELECT id FROM traders WHERE token = $1 AND user_id = $2",
      [token, user.id]
    );
    tokenValid = traderResult.rows.length > 0;
  } else if (user.role === "admin") {
    const adminResult = await pool.query(
      "SELECT id FROM admins WHERE token = $1",
      [token]
    );
    tokenValid = adminResult.rows.length > 0;
  } else if (user.role === "merchant") {
    // Для мерчанта — пока заглушка
    tokenValid = token === "merchant_demo_token";
  }

  if (!tokenValid) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // 4. Если 2FA включена — просим код
  if (user.two_factor_secret) {
    return res.status(200).json({
      requiresTwoFactor: true,
      userId: user.id,
      message: "2FA code required"
    });
  }

  // 5. Если 2FA не включена — создаём сессию
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  await pool.query(
    `INSERT INTO user_sessions (user_id, token, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, sessionToken, expiresAt, req.ip, req.headers["user-agent"]]
  );

  res.json({
    success: true,
    sessionToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

// Проверка 2FA кода
router.post("/verify-2fa", async (req, res) => {
  const { userId, twoFactorCode } = req.body;

  if (!userId || !twoFactorCode) {
    return res.status(400).json({ error: "User ID and 2FA code are required" });
  }

  const userResult = await pool.query(
    "SELECT id, email, role, two_factor_secret, is_active FROM users WHERE id = $1",
    [userId]
  );

  if (userResult.rows.length === 0) {
    return res.status(401).json({ error: "User not found" });
  }

  const user = userResult.rows[0];

  if (!user.two_factor_secret) {
    return res.status(400).json({ error: "2FA not enabled" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: "base32",
    token: twoFactorCode,
    window: 1
  });

  if (!verified) {
    return res.status(401).json({ error: "Invalid 2FA code" });
  }

  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  await pool.query(
    `INSERT INTO user_sessions (user_id, token, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [user.id, sessionToken, expiresAt, req.ip, req.headers["user-agent"]]
  );

  res.json({
    success: true,
    sessionToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

// Логаут
router.post("/logout", async (req, res) => {
  const sessionToken = req.headers["x-session-token"] as string;

  if (sessionToken) {
    await pool.query("DELETE FROM user_sessions WHERE token = $1", [sessionToken]);
  }

  res.json({ success: true });
});

// Получение текущего пользователя
router.get("/me", async (req, res) => {
  const sessionToken = req.headers["x-session-token"] as string;

  if (!sessionToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const sessionResult = await pool.query(
    `SELECT u.id, u.email, u.role, u.is_active
     FROM user_sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [sessionToken]
  );

  if (sessionResult.rows.length === 0) {
    return res.status(401).json({ error: "Session expired" });
  }

  const user = sessionResult.rows[0];
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    is_active: user.is_active
  });
});

// Старые эндпоинты (для обратной совместимости)
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
