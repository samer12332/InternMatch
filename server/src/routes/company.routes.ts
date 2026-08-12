import { UserRole } from "@prisma/client";
import { Router } from "express";

import {
    createInternshipHandler,
    deleteInternshipHandler,
    getInternshipsHandler,
    updateInternshipHandler,
} from "../company/company-internship.controller";
import {
    getStudentProfileHandler,
    recordStudentProfileViewHandler,
    searchStudentsHandler,
} from "../company/company-student.controller";
import {
    createInternshipSchema,
    internshipIdParamsSchema,
    updateInternshipSchema,
} from "../company/company-internship.schemas";
import {
    studentIdParamsSchema,
    studentSearchSchema,
} from "../company/company-student.schemas";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "../middlewares/validate.middleware";

export const companyRouter = Router();

companyRouter.use(authenticate, requireRole(UserRole.COMPANY));

companyRouter.get(
    "/students",
    validateQuery(studentSearchSchema),
    searchStudentsHandler,
);
companyRouter.get(
    "/students/:studentId",
    validateParams(studentIdParamsSchema),
    getStudentProfileHandler,
);
companyRouter.post(
    "/students/:studentId/views",
    validateParams(studentIdParamsSchema),
    recordStudentProfileViewHandler,
);
companyRouter.post(
    "/internships",
    validateBody(createInternshipSchema),
    createInternshipHandler,
);
companyRouter.get("/internships", getInternshipsHandler);
companyRouter.patch(
    "/internships/:id",
    validateParams(internshipIdParamsSchema),
    validateBody(updateInternshipSchema),
    updateInternshipHandler,
);
companyRouter.delete(
    "/internships/:id",
    validateParams(internshipIdParamsSchema),
    deleteInternshipHandler,
);
