import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createDonorSchema, updateDonorSchema } from "../validators/donor";
import * as ctrl from "../controllers/donor.controller";

const router = Router();

router.get("/", authenticate, ctrl.getDonors);
router.get("/:id", authenticate, ctrl.getDonorById);
router.post("/", authenticate, authorize("admin", "accountant"), validate(createDonorSchema), ctrl.createDonor);
router.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateDonorSchema), ctrl.updateDonor);
router.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteDonor);

export { router as donorRouter };
