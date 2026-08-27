import { z } from "zod";

export const createFundSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["construction", "madrasa", "zakat", "fitrana", "khairat", "general"]),
  description: z.string().default(""),
  status: z.enum(["active", "inactive", "closed"]).default("active"),
});

export const updateFundSchema = createFundSchema.partial();

export type CreateFundInput = z.infer<typeof createFundSchema>;
export type UpdateFundInput = z.infer<typeof updateFundSchema>;
