import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().default(""),
  phone: z.string().default(""),
  className: z.string().min(1, "Class is required"),
  admissionDate: z.string().optional(),
  monthlyFee: z.number().min(0).default(0),
  status: z.enum(["active", "inactive", "graduated"]).default("active"),
  notes: z.string().default(""),
});

export const updateStudentSchema = createStudentSchema.partial();

export const createTeacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().default(""),
  subject: z.string().default(""),
  salary: z.number().min(0, "Salary cannot be negative"),
  joiningDate: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  notes: z.string().default(""),
});

export const updateTeacherSchema = createTeacherSchema.partial();
