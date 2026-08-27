import { Router, Request, Response } from "express";
import { isConnected } from "../config/database";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Madni Masjid API is running",
    database: isConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };
