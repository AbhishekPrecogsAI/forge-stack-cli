import { Router } from "express";

import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { getHealth } from "./health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", asyncHandler(getHealth));
