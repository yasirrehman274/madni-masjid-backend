import { Receipt, IReceipt } from "../models/receipt";
import { generateReceiptNumber } from "../utils/helpers";

export async function createReceipt(data: Partial<IReceipt>) {
  let receiptNumber = generateReceiptNumber();
  let exists = await Receipt.exists({ receiptNumber });
  let attempts = 0;

  while (exists && attempts < 10) {
    receiptNumber = generateReceiptNumber();
    exists = await Receipt.exists({ receiptNumber });
    attempts++;
  }

  return Receipt.create({ ...data, receiptNumber });
}

export async function getReceipts(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.search) {
    query.receiptNumber = { $regex: filter.search, $options: "i" };
  }

  const [data, total] = await Promise.all([
    Receipt.find(query)
      .populate("donorId", "name phone")
      .populate("fundId", "name type")
      .populate("donationId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Receipt.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getReceiptById(id: string) {
  return Receipt.findById(id)
    .populate("donorId")
    .populate("fundId")
    .populate("donationId")
    .lean();
}

export async function getReceiptByDonationId(donationId: string) {
  return Receipt.findOne({ donationId }).lean();
}

export async function getReceiptByNumber(receiptNumber: string) {
  return Receipt.findOne({ receiptNumber })
    .populate("donorId")
    .populate("fundId")
    .populate("donationId")
    .lean();
}
