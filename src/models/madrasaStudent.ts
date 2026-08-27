import mongoose, { Schema, Document } from "mongoose";

export interface IMadrasaStudent extends Document {
  name: string;
  fatherName: string;
  phone: string;
  className: string;
  admissionDate?: Date;
  monthlyFee: number;
  status: string;
  notes: string;
}

const schema = new Schema<IMadrasaStudent>(
  {
    name: { type: String, required: true },
    fatherName: { type: String, default: "" },
    phone: { type: String, default: "" },
    className: { type: String, required: true },
    admissionDate: { type: Date },
    monthlyFee: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MadrasaStudent = mongoose.model<IMadrasaStudent>(
  "MadrasaStudent",
  schema,
  "madrasa_students"
);
