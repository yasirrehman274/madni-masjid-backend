import mongoose from "mongoose";
import { Fund } from "../models/fund";
import { Donation } from "../models/donation";
import { Expense } from "../models/expense";

export async function getFundSummary(fundId?: string, from?: string, to?: string) {
  const funds = fundId
    ? await Fund.find({ _id: fundId }).lean()
    : await Fund.find({}).lean();

  const dateFilter: Record<string, any> = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = new Date(from);
    if (to) dateFilter.date.$lte = new Date(to);
  }

  return Promise.all(
    funds.map(async (fund) => {
      const matchStage = { fundId: new mongoose.Types.ObjectId(fund._id.toString()), ...dateFilter };

      const [donationAgg, expenseAgg] = await Promise.all([
        Donation.aggregate([
          { $match: matchStage },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
          { $match: matchStage },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      const totalDonations = donationAgg[0]?.total || 0;
      const totalExpenses = expenseAgg[0]?.total || 0;

      return {
        fundId: fund._id,
        name: fund.name,
        type: fund.type,
        totalDonations,
        totalExpenses,
        balance: totalDonations - totalExpenses,
      };
    })
  );
}

export async function getDonationReport(
  from?: string,
  to?: string,
  fundId?: string,
  paymentMethod?: string
) {
  const query: Record<string, any> = {};

  if (fundId) query.fundId = fundId;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  return Donation.find(query)
    .populate("donorId", "name phone")
    .populate("fundId", "name type")
    .sort({ date: -1 })
    .lean();
}

export async function getExpenseReport(
  from?: string,
  to?: string,
  fundId?: string,
  paymentMethod?: string
) {
  const query: Record<string, any> = {};

  if (fundId) query.fundId = fundId;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  return Expense.find(query)
    .populate("fundId", "name type")
    .sort({ date: -1 })
    .lean();
}

export async function getMonthlySummary(from?: string, to?: string) {
  const now = new Date();
  const startDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const endDate = to ? new Date(to) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [donationData, expenseData] = await Promise.all([
    Donation.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const monthMap = new Map<string, { donations: number; donationCount: number; expenses: number; expenseCount: number }>();

  donationData.forEach((d) => {
    monthMap.set(d._id, {
      donations: d.total,
      donationCount: d.count,
      expenses: monthMap.get(d._id)?.expenses || 0,
      expenseCount: monthMap.get(d._id)?.expenseCount || 0,
    });
  });

  expenseData.forEach((e) => {
    const existing = monthMap.get(e._id) || { donations: 0, donationCount: 0, expenses: 0, expenseCount: 0 };
    monthMap.set(e._id, {
      ...existing,
      expenses: e.total,
      expenseCount: e.count,
    });
  });

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
