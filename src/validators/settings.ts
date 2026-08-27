import { z } from "zod";

export const updateSettingsSchema = z.object({
  mosqueName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  currency: z.string().optional(),
  dateFormat: z.string().optional(),
});
