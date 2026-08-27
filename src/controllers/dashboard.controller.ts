import { Request, Response } from "express";
import { apiResponse } from "../utils/helpers";
import * as dashboardService from "../services/dashboard.service";

export async function getDashboard(_req: Request, res: Response) {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.json(apiResponse(true, undefined, summary));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
