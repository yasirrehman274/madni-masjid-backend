import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFund extends Document {
  name: string;
  type: string;
  description: string;
  status: string;
}

const schema = new Schema<IFund>(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["construction", "madrasa", "zakat", "fitrana", "khairat", "general"],
    },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

schema.index({ type: 1 });

export const Fund: Model<IFund> =
  (mongoose.models.Fund as Model<IFund>) || mongoose.model<IFund>("Fund", schema);
