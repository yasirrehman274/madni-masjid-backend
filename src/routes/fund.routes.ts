import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createFundSchema, updateFundSchema } from "../validators/fund";
import * as ctrl from "../controllers/fund.controller";

const router = Router();

router.get("/", authenticate, ctrl.getFunds);
router.get("/balances/all", authenticate, ctrl.getFundBalances);
router.get("/:id", authenticate, ctrl.getFundById);
router.post("/", authenticate, authorize("admin", "accountant"), validate(createFundSchema), ctrl.createFund);
router.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateFundSchema), ctrl.updateFund);
router.delete("/:id", authenticate, authorize("admin"), ctrl.deleteFund);

export { router as fundRouter };
