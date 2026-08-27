import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as receiptService from "../services/receipt.service";

export async function getReceipts(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = req.query.search as string | undefined;
    const filter: Record<string, any> = {};
    if (search) filter.search = search;

    const result = await receiptService.getReceipts(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getReceiptById(req: Request, res: Response) {
  try {
    const receipt = await receiptService.getReceiptById(String(req.params.id));
    if (!receipt) {
      res.status(404).json(apiResponse(false, "Receipt not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { receipt }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
