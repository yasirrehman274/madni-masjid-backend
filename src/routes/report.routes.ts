import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as ctrl from "../controllers/report.controller";

const router = Router();

router.get("/fund-summary", authenticate, ctrl.getFundSummary);
router.get("/donations", authenticate, ctrl.getDonationReport);
router.get("/expenses", authenticate, ctrl.getExpenseReport);
router.get("/monthly", authenticate, ctrl.getMonthlySummary);

export { router as reportRouter };
