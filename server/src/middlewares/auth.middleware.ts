import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

type AccessTokenPayload = JwtPayload & {
  userId?: unknown;
};

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication is required", 401));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;

    if (typeof payload.userId !== "string") {
      throw new Error("Invalid token payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      next(new AppError("Authentication is required", 401));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(new AppError("Authentication is required", 401));
  }
};
