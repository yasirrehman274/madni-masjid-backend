import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createDonationSchema, updateDonationSchema } from "../validators/donation";
import * as ctrl from "../controllers/donation.controller";

const router = Router();

router.get("/", authenticate, ctrl.getDonations);
router.get("/:id", authenticate, ctrl.getDonationById);
router.post("/", authenticate, authorize("admin", "accountant"), validate(createDonationSchema), ctrl.createDonation);
router.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateDonationSchema), ctrl.updateDonation);
router.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteDonation);

export { router as donationRouter };
