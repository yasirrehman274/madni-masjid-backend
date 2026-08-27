import { Router } from "express";
import { healthRouter } from "./health";
import { authRouter } from "./auth.routes";
import { fundRouter } from "./fund.routes";
import { donorRouter } from "./donor.routes";
import { donationRouter } from "./donation.routes";
import { expenseRouter } from "./expense.routes";
import { receiptRouter } from "./receipt.routes";
import { userRouter } from "./user.routes";
import { settingsRouter } from "./settings.routes";
import { auditRouter } from "./audit.routes";
import { dashboardRouter } from "./dashboard.routes";
import { reportRouter } from "./report.routes";
import { constructionRouter, constructionExpensesRouter } from "./construction.routes";
import { madrasaStudentRouter, madrasaTeacherRouter } from "./madrasa.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/funds", fundRouter);
apiRouter.use("/donors", donorRouter);
apiRouter.use("/donations", donationRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/receipts", receiptRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/audit-logs", auditRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/construction", constructionRouter);
apiRouter.use("/construction-expenses", constructionExpensesRouter);
apiRouter.use("/madrasa/students", madrasaStudentRouter);
apiRouter.use("/madrasa/teachers", madrasaTeacherRouter);

export { apiRouter };
