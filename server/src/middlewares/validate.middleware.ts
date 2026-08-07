import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { AppError } from "../utils/AppError";

export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(result.error.issues[0]?.message ?? "Invalid request body", 400));
    return;
  }

  req.body = result.data;
  next();
};
