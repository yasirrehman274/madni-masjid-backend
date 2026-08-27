import { Request, Response } from "express";
import { apiResponse } from "../utils/helpers";
import * as reportService from "../services/report.service";

export async function getFundSummary(req: Request, res: Response) {
  try {
    const fundId = req.query.fundId as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const summary = await reportService.getFundSummary(fundId, from, to);
    res.json(apiResponse(true, undefined, { summary }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getDonationReport(req: Request, res: Response) {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const fundId = req.query.fundId as string | undefined;
    const paymentMethod = req.query.paymentMethod as string | undefined;

    const donations = await reportService.getDonationReport(from, to, fundId, paymentMethod);
    res.json(apiResponse(true, undefined, { donations }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getExpenseReport(req: Request, res: Response) {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const fundId = req.query.fundId as string | undefined;
    const paymentMethod = req.query.paymentMethod as string | undefined;

    const expenses = await reportService.getExpenseReport(from, to, fundId, paymentMethod);
    res.json(apiResponse(true, undefined, { expenses }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getMonthlySummary(req: Request, res: Response) {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const summary = await reportService.getMonthlySummary(from, to);
    res.json(apiResponse(true, undefined, { summary }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
