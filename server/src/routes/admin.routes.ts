import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
    getDistributionResultsHandler,
    getDistributionSummaryHandler,
    runDistributionHandler,
} from "../distribution/distribution.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

export const adminRouter = Router();
adminRouter.use(authenticate, requireRole(UserRole.ADMIN));
adminRouter.post("/distribution/run", runDistributionHandler);
adminRouter.get("/distribution/summary", getDistributionSummaryHandler);
adminRouter.get("/distribution/results", getDistributionResultsHandler);
