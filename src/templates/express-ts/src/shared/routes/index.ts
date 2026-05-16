import { Router } from "express";

import { healthRouter } from "../../modules/health/health.routes.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Forge Stack Express API"
  });
});

apiRouter.use("/health", healthRouter);
