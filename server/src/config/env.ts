import "dotenv/config";

const requiredEnvironmentVariable = (name: "DATABASE_URL" | "JWT_SECRET") => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
};

const databaseUrl = requiredEnvironmentVariable("DATABASE_URL");
const jwtSecret = requiredEnvironmentVariable("JWT_SECRET");

const port = Number(process.env.PORT ?? 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
} as const;
