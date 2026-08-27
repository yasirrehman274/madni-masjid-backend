import mongoose, { Schema, Document } from "mongoose";

export interface IConstructionExpense extends Document {
  projectId: mongoose.Types.ObjectId;
  fundId: mongoose.Types.ObjectId;
  category: string;
  description: string;
  vendor: string;
  amount: number;
  paymentMethod: string;
  date: Date;
  reference: string;
  notes: string;
  createdBy: mongoose.Types.ObjectId | null;
}

const schema = new Schema<IConstructionExpense>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "ConstructionProject", required: true },
    fundId: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    vendor: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "bank", "online", "cheque", "other"],
    },
    date: { type: Date, required: true },
    reference: { type: String, default: "" },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

schema.index({ projectId: 1 });
schema.index({ fundId: 1 });

export const ConstructionExpense = mongoose.model<IConstructionExpense>(
  "ConstructionExpense",
  schema,
  "construction_expenses"
);
