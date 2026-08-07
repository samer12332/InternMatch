import type { UserRole } from "@prisma/client";
import type { RequestHandler } from "express";

import { AppError } from "../utils/AppError";

export const requireRole = (...roles: UserRole[]): RequestHandler => (req, _res, next) => {
  if (!req.user) {
    next(new AppError("Authentication is required", 401));
    return;
  }

  if (!roles.includes(req.user.role)) {
    next(new AppError("You are not authorized to access this resource", 403));
    return;
  }

  next();
};
