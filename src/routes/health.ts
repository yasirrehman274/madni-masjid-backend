import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, status: "ok" });
});

export { router as healthRouter };