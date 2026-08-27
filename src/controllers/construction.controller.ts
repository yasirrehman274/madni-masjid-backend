import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as constructionService from "../services/construction.service";

export async function createProject(req: Request, res: Response) {
  try {
    const project = await constructionService.createProject(req.body);
    res.status(201).json(apiResponse(true, "Project created", { project }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(400).json(apiResponse(false, message));
  }
}

export async function getProjects(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await constructionService.getProjects({ page, limit, skip });
    if ("data" in result) {
      res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
    } else {
      res.json(apiResponse(true, undefined, { data: result }));
    }
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const project = await constructionService.getProjectById(String(req.params.id));
    if (!project) {
      res.status(404).json(apiResponse(false, "Project not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { project }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const project = await constructionService.updateProject(String(req.params.id), req.body);
    if (!project) {
      res.status(404).json(apiResponse(false, "Project not found"));
      return;
    }
    res.json(apiResponse(true, "Project updated", { project }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const project = await constructionService.deleteProject(String(req.params.id));
    if (!project) {
      res.status(404).json(apiResponse(false, "Project not found"));
      return;
    }
    res.json(apiResponse(true, "Project deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function createConstructionExpense(req: Request, res: Response) {
  try {
    const authReq = req as AuthenticatedRequest;
    const expense = await constructionService.createConstructionExpense(req.body, authReq.user?.userId);
    res.status(201).json(apiResponse(true, "Construction expense created", { expense }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(400).json(apiResponse(false, message));
  }
}

export async function getConstructionExpenses(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const projectId = req.query.projectId as string | undefined;
    const result = await constructionService.getConstructionExpenses(projectId, { page, limit, skip });
    if ("data" in result) {
      res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
    } else {
      res.json(apiResponse(true, undefined, { data: result }));
    }
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getConstructionExpenseById(req: Request, res: Response) {
  try {
    const expense = await constructionService.getConstructionExpenseById(String(req.params.id));
    if (!expense) {
      res.status(404).json(apiResponse(false, "Construction expense not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { expense }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateConstructionExpense(req: Request, res: Response) {
  try {
    const expense = await constructionService.updateConstructionExpense(String(req.params.id), req.body);
    if (!expense) {
      res.status(404).json(apiResponse(false, "Construction expense not found"));
      return;
    }
    res.json(apiResponse(true, "Construction expense updated", { expense }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteConstructionExpense(req: Request, res: Response) {
  try {
    const expense = await constructionService.deleteConstructionExpense(String(req.params.id));
    if (!expense) {
      res.status(404).json(apiResponse(false, "Construction expense not found"));
      return;
    }
    res.json(apiResponse(true, "Construction expense deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
