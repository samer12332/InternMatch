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

export const validateParams = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    next(new AppError(result.error.issues[0]?.message ?? "Invalid route parameters", 400));
    return;
  }

  next();
};

export const validateQuery = (schema: ZodType): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    next(new AppError(result.error.issues[0]?.message ?? "Invalid query parameters", 400));
    return;
  }

  res.locals.validatedQuery = result.data;
  next();
};
