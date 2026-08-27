import mongoose from "mongoose";
import { Donation } from "../models/donation";
import { Expense } from "../models/expense";
import { Fund } from "../models/fund";

export async function getDashboardSummary(): Promise<Record<string, unknown>> {
  const [totalDonationsResult, totalExpensesResult] = await Promise.all([
    Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  const totalDonations = totalDonationsResult[0]?.total || 0;
  const totalExpenses = totalExpensesResult[0]?.total || 0;

  const funds = await Fund.find({}).lean();
  const fundBalances = await Promise.all(
    funds.map(async (fund) => {
      const [donationAgg, expenseAgg] = await Promise.all([
        Donation.aggregate([
          { $match: { fundId: new mongoose.Types.ObjectId(fund._id.toString()) } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
          { $match: { fundId: new mongoose.Types.ObjectId(fund._id.toString()) } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);
      const donations = donationAgg[0]?.total || 0;
      const expenses = expenseAgg[0]?.total || 0;
      return { ...fund, donations, expenses, balance: donations - expenses };
    })
  );

  const [recentDonations, recentExpenses] = await Promise.all([
    Donation.find()
      .populate("donorId", "name phone")
      .populate("fundId", "name")
      .sort({ date: -1 })
      .limit(5)
      .lean(),
    Expense.find()
      .populate("fundId", "name")
      .sort({ date: -1 })
      .limit(5)
      .lean(),
  ]);

  const now = new Date();
  const monthlySummary = [];
  for (let i = 5; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
    const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`;

    const [monthDonations, monthExpenses] = await Promise.all([
      Donation.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    monthlySummary.push({
      month: monthKey,
      donations: monthDonations[0]?.total || 0,
      expenses: monthExpenses[0]?.total || 0,
    });
  }

  return {
    totalDonations,
    totalExpenses,
    fundBalances,
    recentDonations,
    recentExpenses,
    monthlySummary,
  };
}
