import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as expenseService from "../services/expense.service";

export async function createExpense(req: AuthenticatedRequest, res: Response) {
  try {
    const expense = await expenseService.createExpense(
      req.body,
      req.user?.userId,
      req.user?.name
    );
    res.status(201).json(apiResponse(true, "Expense created", { expense }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("Insufficient") || message.includes("not found") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getExpenses(req: AuthenticatedRequest, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter: Record<string, any> = {};
    if (req.query.fundId) filter.fundId = req.query.fundId;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to) filter.to = req.query.to;

    const result = await expenseService.getExpenses(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getExpenseById(req: AuthenticatedRequest, res: Response) {
  try {
    const expense = await expenseService.getExpenseById(String(req.params.id));
    if (!expense) {
      res.status(404).json(apiResponse(false, "Expense not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { expense }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateExpense(req: AuthenticatedRequest, res: Response) {
  try {
    const expense = await expenseService.updateExpense(String(req.params.id), req.body);
    if (!expense) {
      res.status(404).json(apiResponse(false, "Expense not found"));
      return;
    }
    res.json(apiResponse(true, "Expense updated", { expense }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("Insufficient") || message.includes("not found") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function deleteExpense(req: AuthenticatedRequest, res: Response) {
  try {
    const expense = await expenseService.deleteExpense(String(req.params.id));
    if (!expense) {
      res.status(404).json(apiResponse(false, "Expense not found"));
      return;
    }
    res.json(apiResponse(true, "Expense deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
