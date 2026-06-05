-- Migration 002: Add users and sessions for new auth system

-- 1. Таблица users
CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  role                VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'merchant', 'trader')),
  two_factor_secret   VARCHAR(255),
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- 2. Таблица user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(255) UNIQUE NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  ip          VARCHAR(45),
  user_agent  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 3. Связь старых трейдеров с пользователями
ALTER TABLE traders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- 4. Создаём админа (пароль: admin123)
INSERT INTO users (email, password_hash, role, is_active)
VALUES ('admin@players2pay.com', '$2b$10$5v5ZJ5a5ZJ5a5ZJ5a5ZJ5u5v5ZJ5a5ZJ5a5ZJ5a5ZJ5a5ZJ5a5ZJ5', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- 5. Создаём тестового трейдера как пользователя
INSERT INTO users (email, password_hash, role, is_active)
VALUES ('trader@players2pay.com', '$2b$10$5v5ZJ5a5ZJ5a5ZJ5a5ZJ5u5v5ZJ5a5ZJ5a5ZJ5a5ZJ5a5ZJ5a5ZJ5', 'trader', true)
ON CONFLICT (email) DO NOTHING;

-- 6. Привязываем существующего трейдера (если есть)
UPDATE traders SET user_id = (SELECT id FROM users WHERE email = 'trader@players2pay.com')
WHERE id = 1 AND user_id IS NULL;
