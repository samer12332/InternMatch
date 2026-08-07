import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured.");
}

const port = Number(process.env.PORT ?? 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl,
} as const;
