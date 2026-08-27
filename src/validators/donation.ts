import { z } from "zod";

export const createDonationSchema = z.object({
  donorId: z.string().min(1, "Donor is required"),
  fundId: z.string().min(1, "Fund is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["cash", "bank", "online", "cheque", "other"]),
  date: z.string().min(1, "Date is required"),
  reference: z.string().default(""),
  notes: z.string().default(""),
});

export const updateDonationSchema = createDonationSchema.partial().omit({ donorId: true, fundId: true });

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
