import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import { apiResponse } from "../utils/helpers";
import * as authService from "../services/auth.service";

export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json(apiResponse(false, "Email and password are required"));
      return;
    }

    const result = await authService.login(email, password);
    res.json(apiResponse(true, undefined, result));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("Invalid") || message.includes("inactive") ? 401 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json(apiResponse(false, "Not authenticated"));
      return;
    }

    const user = await authService.getMe(req.user.userId);
    if (!user) {
      res.status(404).json(apiResponse(false, "User not found"));
      return;
    }

    res.json(apiResponse(true, undefined, { user }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
