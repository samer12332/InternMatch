import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { apiRouter } from "./routes";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
