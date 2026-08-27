import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as userService from "../services/user.service";

export async function createUser(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(apiResponse(true, "User created", { user }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("already exists") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await userService.getUsers({ page, limit, skip });
    if (!result || !("data" in result)) {
      res.json(apiResponse(true, undefined, { users: result }));
      return;
    }
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(String(req.params.id));
    if (!user) {
      res.status(404).json(apiResponse(false, "User not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { user }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(String(req.params.id), req.body);
    if (!user) {
      res.status(404).json(apiResponse(false, "User not found"));
      return;
    }
    res.json(apiResponse(true, "User updated", { user }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("already exists") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await userService.deleteUser(String(req.params.id));
    if (!user) {
      res.status(404).json(apiResponse(false, "User not found"));
      return;
    }
    res.json(apiResponse(true, "User deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
