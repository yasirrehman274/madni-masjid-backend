import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as fundService from "../services/fund.service";

export async function createFund(req: Request, res: Response) {
  try {
    const fund = await fundService.createFund(req.body);
    res.status(201).json(apiResponse(true, "Fund created", { fund }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("already exists") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getFunds(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = req.query.search as string | undefined;
    const result = await fundService.getFunds({ search }, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getFundById(req: Request, res: Response) {
  try {
    const fund = await fundService.getFundById(String(req.params.id));
    if (!fund) {
      res.status(404).json(apiResponse(false, "Fund not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { fund }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateFund(req: Request, res: Response) {
  try {
    const fund = await fundService.updateFund(String(req.params.id), req.body);
    if (!fund) {
      res.status(404).json(apiResponse(false, "Fund not found"));
      return;
    }
    res.json(apiResponse(true, "Fund updated", { fund }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteFund(req: Request, res: Response) {
  try {
    const fund = await fundService.deleteFund(String(req.params.id));
    if (!fund) {
      res.status(404).json(apiResponse(false, "Fund not found"));
      return;
    }
    res.json(apiResponse(true, "Fund deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getFundBalances(_req: Request, res: Response) {
  try {
    const balances = await fundService.getAllFundBalances();
    res.json(apiResponse(true, undefined, { balances }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
