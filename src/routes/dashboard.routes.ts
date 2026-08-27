import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as ctrl from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authenticate, ctrl.getDashboard);

export { router as dashboardRouter };
