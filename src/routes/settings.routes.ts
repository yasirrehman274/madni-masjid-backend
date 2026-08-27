import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateSettingsSchema } from "../validators/settings";
import * as ctrl from "../controllers/settings.controller";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", ctrl.getSettings);
router.put("/", validate(updateSettingsSchema), ctrl.updateSettings);

export { router as settingsRouter };
