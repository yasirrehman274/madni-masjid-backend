import { z } from "zod";

export const createDonorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().default(""),
  address: z.string().default(""),
  notes: z.string().default(""),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const updateDonorSchema = createDonorSchema.partial();

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
