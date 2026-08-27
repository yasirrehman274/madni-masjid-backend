import mongoose from "mongoose";
import { Donation, IDonation } from "../models/donation";
import { Donor } from "../models/donor";
import { Fund } from "../models/fund";
import { Receipt } from "../models/receipt";
import { generateReceiptNumber } from "../utils/helpers";

export async function createDonation(data: Partial<IDonation>, userId?: string) {
  const donor = await Donor.findById(data.donorId);
  if (!donor) throw new Error("Donor not found");

  const fund = await Fund.findById(data.fundId);
  if (!fund) throw new Error("Fund not found");

  const session = await mongoose.startSession();
  try {
    session.startTransaction({ readConcern: { level: "snapshot" } });

    const [donation] = await Donation.create(
      [{ ...data, createdBy: userId || null }],
      { session }
    );

    const receiptNumber = await generateUniqueReceiptNumber();
    const [receipt] = await Receipt.create(
      [
        {
          receiptNumber,
          donationId: donation._id,
          donorId: donation.donorId,
          fundId: donation.fundId,
          amount: donation.amount,
          paymentMethod: donation.paymentMethod,
          date: donation.date,
          issuedBy: userId || null,
        },
      ],
      { session }
    );

    await Donation.findByIdAndUpdate(
      donation._id,
      { receiptId: receipt._id },
      { session }
    );

    await session.commitTransaction();
    return Donation.findById(donation._id).populate("donorId fundId receiptId").lean();
  } catch (error: any) {
    if (error.errorLabels?.includes("TransientTransactionError")) {
      // Replica set not available, fall back to non-transactional
      session.endSession();
      return createDonationFallback(data, userId);
    }
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function createDonationFallback(data: Partial<IDonation>, userId?: string) {
  const donation = await Donation.create({ ...data, createdBy: userId || null });

  const receiptNumber = await generateUniqueReceiptNumber();
  const receipt = await Receipt.create({
    receiptNumber,
    donationId: donation._id,
    donorId: donation.donorId,
    fundId: donation.fundId,
    amount: donation.amount,
    paymentMethod: donation.paymentMethod,
    date: donation.date,
    issuedBy: userId || null,
  });

  await Donation.findByIdAndUpdate(donation._id, { receiptId: receipt._id });

  return Donation.findById(donation._id).populate("donorId fundId receiptId").lean();
}

async function generateUniqueReceiptNumber(): Promise<string> {
  let receiptNumber = generateReceiptNumber();
  let exists = await Receipt.exists({ receiptNumber });
  let attempts = 0;
  while (exists && attempts < 10) {
    receiptNumber = generateReceiptNumber();
    exists = await Receipt.exists({ receiptNumber });
    attempts++;
  }
  return receiptNumber;
}

export async function getDonations(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.fundId) query.fundId = filter.fundId;
  if (filter.donorId) query.donorId = filter.donorId;
  if (filter.paymentMethod) query.paymentMethod = filter.paymentMethod;
  if (filter.from || filter.to) {
    query.date = {};
    if (filter.from) query.date.$gte = new Date(filter.from);
    if (filter.to) query.date.$lte = new Date(filter.to);
  }

  const [data, total] = await Promise.all([
    Donation.find(query)
      .populate("donorId", "name phone")
      .populate("fundId", "name type")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })
      .lean(),
    Donation.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDonationById(id: string) {
  return Donation.findById(id)
    .populate("donorId")
    .populate("fundId")
    .populate("receiptId")
    .lean();
}

export async function updateDonation(id: string, data: Partial<IDonation>) {
  return Donation.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteDonation(id: string) {
  const donation = await Donation.findById(id);
  if (donation?.receiptId) {
    await Receipt.findByIdAndDelete(donation.receiptId);
  }
  return Donation.findByIdAndDelete(id);
}

export async function getDonationsByFund(fundId: string) {
  return Donation.find({ fundId }).populate("donorId", "name phone").sort({ date: -1 }).lean();
}

export async function getDonationsByDateRange(from: string, to: string) {
  return Donation.find({
    date: { $gte: new Date(from), $lte: new Date(to) },
  })
    .populate("donorId", "name phone")
    .populate("fundId", "name type")
    .sort({ date: -1 })
    .lean();
}
