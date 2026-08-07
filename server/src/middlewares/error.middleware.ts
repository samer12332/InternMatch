import type { ErrorRequestHandler } from "express";

import { AppError } from "../utils/AppError";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const isExpectedError = error instanceof AppError;
  const statusCode = isExpectedError ? error.statusCode : 500;

  if (!isExpectedError) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: isExpectedError ? error.message : "Internal server error",
  });
};
