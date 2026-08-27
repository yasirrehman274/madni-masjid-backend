import { Request, Response } from "express";
import { apiResponse } from "../utils/helpers";
import * as settingsService from "../services/settings.service";

export async function getSettings(_req: Request, res: Response) {
  try {
    const settings = await settingsService.getSettings();
    res.json(apiResponse(true, undefined, { settings }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const settings = await settingsService.updateSettings(req.body);
    res.json(apiResponse(true, "Settings updated", { settings }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
