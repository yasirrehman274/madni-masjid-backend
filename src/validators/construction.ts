import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  estimatedBudget: z.number().positive("Budget must be positive"),
  status: z.enum(["planning", "in_progress", "completed", "on_hold", "cancelled"]).default("planning"),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  notes: z.string().default(""),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createConstructionExpenseSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  fundId: z.string().min(1, "Fund is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().default(""),
  vendor: z.string().default(""),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["cash", "bank", "online", "cheque", "other"]),
  date: z.string().min(1, "Date is required"),
  reference: z.string().default(""),
  notes: z.string().default(""),
});

export const updateConstructionExpenseSchema = createConstructionExpenseSchema.partial().omit({ projectId: true, fundId: true });
