import mongoose, { Schema, Document } from "mongoose";

export interface IDonor extends Document {
  name: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
}

const schema = new Schema<IDonor>(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

schema.index({ name: "text" });
schema.index({ phone: 1 });

export const Donor = mongoose.model<IDonor>("Donor", schema);
