import { UserRole } from "@prisma/client";
import { Router } from "express";

import {
  createInternshipHandler,
  getInternshipsHandler,
  updateInternshipHandler,
} from "../company/company-internship.controller";
import {
  createInternshipSchema,
  internshipIdParamsSchema,
  updateInternshipSchema,
} from "../company/company-internship.schemas";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validateBody, validateParams } from "../middlewares/validate.middleware";

export const companyRouter = Router();

companyRouter.use(authenticate, requireRole(UserRole.COMPANY));

companyRouter.post("/internships", validateBody(createInternshipSchema), createInternshipHandler);
companyRouter.get("/internships", getInternshipsHandler);
companyRouter.patch(
  "/internships/:id",
  validateParams(internshipIdParamsSchema),
  validateBody(updateInternshipSchema),
  updateInternshipHandler,
);
