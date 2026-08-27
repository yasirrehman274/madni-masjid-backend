import { Fund, IFund } from "../models/fund";
import { Donation } from "../models/donation";
import { Expense } from "../models/expense";

export async function createFund(data: Partial<IFund>) {
  return Fund.create(data);
}

export async function getFunds(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = { ...filter };

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { type: { $regex: filter.search, $options: "i" } },
    ];
    delete query.search;
  }

  const [data, total] = await Promise.all([
    Fund.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Fund.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getFundById(id: string) {
  return Fund.findById(id).lean();
}

export async function updateFund(id: string, data: Partial<IFund>) {
  return Fund.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteFund(id: string) {
  return Fund.findByIdAndDelete(id);
}

export async function getFundBalance(fundId: string) {
  const [donationTotal, expenseTotal] = await Promise.all([
    Donation.aggregate([
      { $match: { fundId: new (require("mongoose").Types.ObjectId)(fundId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { fundId: new (require("mongoose").Types.ObjectId)(fundId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const donations = donationTotal[0]?.total || 0;
  const expenses = expenseTotal[0]?.total || 0;
  return { fundId, donations, expenses, balance: donations - expenses };
}

export async function getAllFundBalances(): Promise<Record<string, unknown>[]> {
  const funds = await Fund.find({}).lean();

  const balances = await Promise.all(
    funds.map(async (fund) => {
      const result = await getFundBalance(fund._id.toString());
      return { ...fund, ...result };
    })
  );

  return balances;
}
