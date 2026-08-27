import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as auditService from "../services/audit.service";

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter: Record<string, any> = {};
    if (req.query.entity) filter.entity = req.query.entity;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to) filter.to = req.query.to;

    const result = await auditService.getAuditLogs(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function clearAuditLogs(_req: Request, res: Response) {
  try {
    await auditService.clearAuditLogs();
    res.json(apiResponse(true, "Audit logs cleared"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
