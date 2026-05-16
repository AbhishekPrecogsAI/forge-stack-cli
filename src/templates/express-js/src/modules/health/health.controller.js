import { getHealthStatus } from "./health.service.js";

export async function getHealth(_req, res) {
  res.status(200).json({
    success: true,
    data: getHealthStatus()
  });
}
