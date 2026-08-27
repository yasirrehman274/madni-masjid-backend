import { z } from "zod";

export const createExpenseSchema = z.object({
  fundId: z.string().min(1, "Fund is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().default(""),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["cash", "bank", "online", "cheque", "other"]),
  date: z.string().min(1, "Date is required"),
  vendor: z.string().default(""),
  reference: z.string().default(""),
  notes: z.string().default(""),
});

export const updateExpenseSchema = createExpenseSchema.partial().omit({ fundId: true });

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
