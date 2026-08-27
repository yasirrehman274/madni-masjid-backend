import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../validators/user";
import * as ctrl from "../controllers/user.controller";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", ctrl.getUsers);
router.get("/:id", ctrl.getUserById);
router.post("/", validate(createUserSchema), ctrl.createUser);
router.put("/:id", validate(updateUserSchema), ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

export { router as userRouter };
