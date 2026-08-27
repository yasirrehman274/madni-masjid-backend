import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import { parsePagination, apiResponse, paginate } from "../utils/helpers";
import * as donationService from "../services/donation.service";

export async function createDonation(req: AuthenticatedRequest, res: Response) {
  try {
    const donation = await donationService.createDonation(req.body, req.user?.userId);
    res.status(201).json(apiResponse(true, "Donation created", { donation }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("not found") || message.includes("already exists") ? 400 : 500;
    res.status(status).json(apiResponse(false, message));
  }
}

export async function getDonations(req: AuthenticatedRequest, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter: Record<string, any> = {};
    if (req.query.fundId) filter.fundId = req.query.fundId;
    if (req.query.donorId) filter.donorId = req.query.donorId;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to) filter.to = req.query.to;

    const result = await donationService.getDonations(filter, { page, limit, skip });
    res.json(apiResponse(true, undefined, { data: result.data, pagination: paginate(page, limit, result.total) }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function getDonationById(req: AuthenticatedRequest, res: Response) {
  try {
    const donation = await donationService.getDonationById(String(req.params.id));
    if (!donation) {
      res.status(404).json(apiResponse(false, "Donation not found"));
      return;
    }
    res.json(apiResponse(true, undefined, { donation }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function updateDonation(req: AuthenticatedRequest, res: Response) {
  try {
    const donation = await donationService.updateDonation(String(req.params.id), req.body);
    if (!donation) {
      res.status(404).json(apiResponse(false, "Donation not found"));
      return;
    }
    res.json(apiResponse(true, "Donation updated", { donation }));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}

export async function deleteDonation(req: AuthenticatedRequest, res: Response) {
  try {
    const donation = await donationService.deleteDonation(String(req.params.id));
    if (!donation) {
      res.status(404).json(apiResponse(false, "Donation not found"));
      return;
    }
    res.json(apiResponse(true, "Donation deleted"));
  } catch (err) {
    res.status(500).json(apiResponse(false, err instanceof Error ? err.message : "Server error"));
  }
}
