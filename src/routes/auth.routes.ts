import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators/auth";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

router.post("/login", validate(loginSchema), ctrl.login);
router.get("/me", authenticate, ctrl.getMe);

export { router as authRouter };
