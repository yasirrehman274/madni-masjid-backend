import mongoose from "mongoose";
import { Expense, IExpense } from "../models/expense";
import { Donation } from "../models/donation";
import { ConstructionExpense } from "../models/constructionExpense";
import { AuditLog } from "../models/auditLog";

async function calculateFundBalance(fundId: string): Promise<number> {
  const [donationResult, expenseResult, constructionResult] = await Promise.all([
    Donation.aggregate([
      { $match: { fundId: new mongoose.Types.ObjectId(fundId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { fundId: new mongoose.Types.ObjectId(fundId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    ConstructionExpense.aggregate([
      { $match: { fundId: new mongoose.Types.ObjectId(fundId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const donations = donationResult[0]?.total || 0;
  const expenses = expenseResult[0]?.total || 0;
  const constructionExpenses = constructionResult[0]?.total || 0;
  return donations - expenses - constructionExpenses;
}

async function validateFundBalance(fundId: string, amount: number, excludeExpenseId?: string) {
  const balance = await calculateFundBalance(fundId);
  if (amount > balance) {
    throw new Error("Insufficient balance in this fund.");
  }
}

export async function createExpense(data: Partial<IExpense>, userId?: string, userName?: string) {
  await validateFundBalance(data.fundId!.toString(), data.amount!);

  const expense = await Expense.create({ ...data, createdBy: userId || null });

  if (userId) {
    await AuditLog.create({
      action: "create",
      entity: "expense",
      entityId: expense._id.toString(),
      description: `Expense of ${data.amount} created for fund ${data.fundId}`,
      userId,
      userName: userName || "",
    });
  }

  return expense;
}

export async function getExpenses(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.fundId) query.fundId = filter.fundId;
  if (filter.category) query.category = filter.category;
  if (filter.paymentMethod) query.paymentMethod = filter.paymentMethod;
  if (filter.from || filter.to) {
    query.date = {};
    if (filter.from) query.date.$gte = new Date(filter.from);
    if (filter.to) query.date.$lte = new Date(filter.to);
  }

  const [data, total] = await Promise.all([
    Expense.find(query)
      .populate("fundId", "name type")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })
      .lean(),
    Expense.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getExpenseById(id: string) {
  return Expense.findById(id).populate("fundId").lean();
}

export async function updateExpense(id: string, data: Partial<IExpense>) {
  const existing = await Expense.findById(id);
  if (!existing) throw new Error("Expense not found");

  const newAmount = data.amount ?? existing.amount;
  const newFundId = (data.fundId ?? existing.fundId).toString();

  if (data.amount || data.fundId) {
    const currentBalance = await calculateFundBalance(existing.fundId.toString());
    const adjustedBalance = currentBalance + existing.amount;
    if (newAmount > adjustedBalance) {
      throw new Error("Insufficient balance in this fund.");
    }
  }

  return Expense.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteExpense(id: string) {
  return Expense.findByIdAndDelete(id);
}

export async function getExpensesByFund(fundId: string) {
  return Expense.find({ fundId }).sort({ date: -1 }).lean();
}

export async function getExpensesByDateRange(from: string, to: string) {
  return Expense.find({
    date: { $gte: new Date(from), $lte: new Date(to) },
  })
    .populate("fundId", "name type")
    .sort({ date: -1 })
    .lean();
}
