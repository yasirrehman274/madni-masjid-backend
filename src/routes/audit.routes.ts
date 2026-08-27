import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/audit.controller";

const router = Router();

router.get("/", authenticate, authorize("admin", "accountant"), ctrl.getAuditLogs);
router.delete("/", authenticate, authorize("admin"), ctrl.clearAuditLogs);

export { router as auditRouter };
