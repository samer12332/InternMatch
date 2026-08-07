import { UserRole } from "@prisma/client";
import { Router } from "express";

import { getEligibleInternshipsHandler } from "../student/student-internship.controller";
import { internshipPaginationSchema } from "../student/student-internship.schemas";
import {
  getStudentWishesHandler,
  replaceStudentWishesHandler,
} from "../student/student-wish.controller";
import { replaceWishesSchema } from "../student/student-wish.schemas";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";

export const studentRouter = Router();

studentRouter.use(authenticate, requireRole(UserRole.STUDENT));
studentRouter.get(
  "/me/internships",
  validateQuery(internshipPaginationSchema),
  getEligibleInternshipsHandler,
);
studentRouter.get("/me/wishes", getStudentWishesHandler);
studentRouter.put("/me/wishes", validateBody(replaceWishesSchema), replaceStudentWishesHandler);
