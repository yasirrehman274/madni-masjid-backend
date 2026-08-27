import mongoose from "mongoose";
import { ConstructionProject, IConstructionProject } from "../models/constructionProject";
import { ConstructionExpense, IConstructionExpense } from "../models/constructionExpense";
import { Fund } from "../models/fund";

export async function createProject(data: Partial<IConstructionProject>) {
  return ConstructionProject.create(data);
}

export async function getProjects(pagination?: { page: number; limit: number; skip: number }) {
  if (pagination) {
    const { page, limit, skip } = pagination;
    const [data, total] = await Promise.all([
      ConstructionProject.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      ConstructionProject.countDocuments(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  return ConstructionProject.find().sort({ createdAt: -1 }).lean();
}

export async function getProjectById(id: string) {
  return ConstructionProject.findById(id).lean();
}

export async function updateProject(id: string, data: Partial<IConstructionProject>) {
  return ConstructionProject.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteProject(id: string) {
  return ConstructionProject.findByIdAndDelete(id);
}

export async function createConstructionExpense(data: Partial<IConstructionExpense>, userId?: string) {
  const project = await ConstructionProject.findById(data.projectId);
  if (!project) throw new Error("Project not found");

  const fund = await Fund.findById(data.fundId);
  if (!fund) throw new Error("Fund not found");

  return ConstructionExpense.create({ ...data, createdBy: userId || null });
}

export async function getConstructionExpenses(
  projectId?: string,
  pagination?: { page: number; limit: number; skip: number }
) {
  const query: Record<string, any> = {};
  if (projectId) query.projectId = projectId;

  if (pagination) {
    const { page, limit, skip } = pagination;
    const [data, total] = await Promise.all([
      ConstructionExpense.find(query)
        .populate("projectId", "name")
        .populate("fundId", "name type")
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
        .lean(),
      ConstructionExpense.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  return ConstructionExpense.find(query)
    .populate("projectId", "name")
    .populate("fundId", "name type")
    .sort({ date: -1 })
    .lean();
}

export async function getConstructionExpenseById(id: string) {
  return ConstructionExpense.findById(id)
    .populate("projectId")
    .populate("fundId")
    .lean();
}

export async function updateConstructionExpense(id: string, data: Partial<IConstructionExpense>) {
  return ConstructionExpense.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteConstructionExpense(id: string) {
  return ConstructionExpense.findByIdAndDelete(id);
}

export async function getProjectTotalSpent(projectId: string) {
  const result = await ConstructionExpense.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  return {
    projectId,
    totalSpent: result[0]?.total || 0,
    expenseCount: result[0]?.count || 0,
  };
}
