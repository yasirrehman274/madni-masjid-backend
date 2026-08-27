import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as ctrl from "../controllers/receipt.controller";

const router = Router();

router.get("/", authenticate, ctrl.getReceipts);
router.get("/:id", authenticate, ctrl.getReceiptById);

export { router as receiptRouter };
