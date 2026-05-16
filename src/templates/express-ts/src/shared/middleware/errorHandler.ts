import type { ErrorRequestHandler } from "express";

import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = error instanceof AppError ? error : new AppError("Internal Server Error", 500);
  const message = error instanceof AppError || env.NODE_ENV !== "production"
    ? appError.message
    : "Internal Server Error";

  const payload: Record<string, unknown> = {
    success: false,
    message
  };

  if (env.NODE_ENV !== "production" && error instanceof Error) {
    payload.stack = error.stack;
  }

  res.status(appError.statusCode).json(payload);
};
