import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  createConstructionExpenseSchema,
  updateConstructionExpenseSchema,
} from "../validators/construction";
import * as ctrl from "../controllers/construction.controller";

const projectRouter = Router();

projectRouter.get("/", authenticate, ctrl.getProjects);
projectRouter.get("/:id", authenticate, ctrl.getProjectById);
projectRouter.post("/", authenticate, authorize("admin", "accountant"), validate(createProjectSchema), ctrl.createProject);
projectRouter.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateProjectSchema), ctrl.updateProject);
projectRouter.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteProject);

const expenseRouter = Router();

expenseRouter.get("/", authenticate, ctrl.getConstructionExpenses);
expenseRouter.get("/:id", authenticate, ctrl.getConstructionExpenseById);
expenseRouter.post("/", authenticate, authorize("admin", "accountant"), validate(createConstructionExpenseSchema), ctrl.createConstructionExpense);
expenseRouter.put("/:id", authenticate, authorize("admin", "accountant"), validate(updateConstructionExpenseSchema), ctrl.updateConstructionExpense);
expenseRouter.delete("/:id", authenticate, authorize("admin", "accountant"), ctrl.deleteConstructionExpense);

export { projectRouter as constructionRouter, expenseRouter as constructionExpensesRouter };
