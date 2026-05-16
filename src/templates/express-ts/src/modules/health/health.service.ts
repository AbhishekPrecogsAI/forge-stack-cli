import { env } from "../../config/env.js";

export function getHealthStatus() {
  return {
    status: "ok",
    service: "forge-stack-express",
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}
