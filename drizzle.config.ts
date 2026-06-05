// drizzle.config.ts
// Note: this project currently uses raw pg queries.
// This file is a placeholder for future Drizzle ORM migration.
import type { Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema/index.ts",
  out: "./server/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
