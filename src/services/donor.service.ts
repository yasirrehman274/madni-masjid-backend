import { Donor, IDonor } from "../models/donor";
import { Donation } from "../models/donation";

export async function createDonor(data: Partial<IDonor>) {
  return Donor.create(data);
}

export async function getDonors(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = { ...filter };

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
    ];
    delete query.search;
  }

  const [data, total] = await Promise.all([
    Donor.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Donor.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDonorById(id: string) {
  return Donor.findById(id).lean();
}

export async function updateDonor(id: string, data: Partial<IDonor>) {
  return Donor.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteDonor(id: string) {
  const donationCount = await Donation.countDocuments({ donorId: id });
  if (donationCount > 0) {
    throw new Error("Cannot delete donor with existing donations");
  }
  return Donor.findByIdAndDelete(id);
}

export async function getDonorTotalDonations(donorId: string) {
  const result = await Donation.aggregate([
    { $match: { donorId: new (require("mongoose").Types.ObjectId)(donorId) } },
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  return {
    donorId,
    totalDonations: result[0]?.total || 0,
    donationCount: result[0]?.count || 0,
  };
}
