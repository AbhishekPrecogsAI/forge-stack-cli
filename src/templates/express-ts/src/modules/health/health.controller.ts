import type { Request, Response } from "express";

import { getHealthStatus } from "./health.service.js";

export async function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: getHealthStatus()
  });
}
