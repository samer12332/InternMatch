import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const httpServer = app.listen(env.port, () => {
    console.log(`InternMatch API listening on port ${env.port}`);
});

let isShuttingDown = false;

const shutdown = (signal: NodeJS.Signals) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Shutting down...`);

    const forceShutdown = setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
    }, 10_000);
    forceShutdown.unref();

    httpServer.close(async (error) => {
        clearTimeout(forceShutdown);

        try {
            await prisma.$disconnect();
        } finally {
            if (error) {
                console.error("HTTP server closed with an error.", error);
                process.exit(1);
            }

            process.exit(0);
        }
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
