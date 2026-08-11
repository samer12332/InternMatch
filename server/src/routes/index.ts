import { Router } from "express";

import { authRouter } from "./auth.routes";
import { companyRouter } from "./company.routes";
import { studentRouter } from "./student.routes";
import { adminRouter } from "./admin.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
        },
    });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/company", companyRouter);
apiRouter.use("/students", studentRouter);
apiRouter.use("/admin", adminRouter);
