import { Request, Response } from "express";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as donorService from "../services/donor.service";

export async function createDonor(req: Request, res: Response) {
  try {
    const donor = await donorService.createDonor(req.body);
    res.status(201).json(apiResponse(true, "Donor created", { donor }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("already exists") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getDonors(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = req.query.search as string | undefined;
    const result = await donorService.getDonors({ search }, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getDonorById(req: Request, res: Response) {
  try {
    const donor = await donorService.getDonorById(String(req.params.id));
    if (!donor) {
      res.status(404).json(apiResponse(false, "Donor not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { donor }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateDonor(req: Request, res: Response) {
  try {
    const donor = await donorService.updateDonor(String(req.params.id), req.body);
    if (!donor) {
      res.status(404).json(apiResponse(false, "Donor not found"));
      return;
    }
    res.json(apiResponse(true, "Donor updated", { donor }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteDonor(req: Request, res: Response) {
  try {
    await donorService.deleteDonor(String(req.params.id));
    res.json(apiResponse(true, "Donor deleted"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("Cannot delete") || message.includes("not found") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}
