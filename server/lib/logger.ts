const levels = { info: "ℹ️", warn: "⚠️", error: "❌" } as const;

function log(level: keyof typeof levels, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = levels[level];
  if (meta !== undefined) {
    console.log(`${prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`, meta);
  } else {
    console.log(`${prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`);
  }
}

export const logger = {
  info:  (msg: string, meta?: unknown) => log("info", msg, meta),
  warn:  (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
