import { Router } from "express";

import {
    loginHandler,
    meHandler,
    registerCompanyHandler,
    registerStudentHandler,
} from "../auth/auth.controller";
import {
    companyRegistrationSchema,
    loginSchema,
    studentRegistrationSchema,
} from "../auth/auth.schemas";
import { authenticate } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";

export const authRouter = Router();

authRouter.post(
    "/register/student",
    validateBody(studentRegistrationSchema),
    registerStudentHandler,
);
authRouter.post(
    "/register/company",
    validateBody(companyRegistrationSchema),
    registerCompanyHandler,
);
authRouter.post("/login", validateBody(loginSchema), loginHandler);
authRouter.get("/me", authenticate, meHandler);
