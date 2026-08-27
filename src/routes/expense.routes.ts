import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createExpenseSchema, updateExpenseSchema } from "../validators/expense";
import * as ctrl from "../controllers/expense.controller";

const router = Router();

router.get("/", authenticate, ctrl.getExpenses);
router.get("/:id", authenticate, ctrl.getExpenseById);
router.post("/", authenticate, authorize("admin", "accountant"), validate(createExpenseSchema), ctrl.createExpense);
router.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateExpenseSchema), ctrl.updateExpense);
router.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteExpense);

export { router as expenseRouter };
