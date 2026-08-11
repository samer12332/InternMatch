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
const maxInternshipsPerMajor = Number(
    process.env.MAX_INTERNSHIPS_PER_MAJOR ?? 3,
);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number.");
}

if (!Number.isInteger(maxInternshipsPerMajor) || maxInternshipsPerMajor < 1) {
    throw new Error("MAX_INTERNSHIPS_PER_MAJOR must be a positive integer.");
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port,
    clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
    databaseUrl,
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    maxInternshipsPerMajor,
} as const;
