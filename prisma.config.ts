import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Enforce presence of DATABASE_URL for DB commands
    url: env("DATABASE_URL"),
    // If you have a separate shadow DB, you can add:
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
