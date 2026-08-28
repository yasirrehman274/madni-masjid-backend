import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMadrasaTeacher extends Document {
  name: string;
  phone: string;
  subject: string;
  salary: number;
  joiningDate?: Date;
  status: string;
  notes: string;
}

const schema = new Schema<IMadrasaTeacher>(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    salary: { type: Number, required: true, min: 0 },
    joiningDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MadrasaTeacher: Model<IMadrasaTeacher> =
  (mongoose.models.MadrasaTeacher as Model<IMadrasaTeacher>) ||
  mongoose.model<IMadrasaTeacher>("MadrasaTeacher", schema, "madrasa_teachers");
