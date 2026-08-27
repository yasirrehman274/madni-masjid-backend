import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  fundId: mongoose.Types.ObjectId;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  date: Date;
  vendor: string;
  reference: string;
  notes: string;
  createdBy: mongoose.Types.ObjectId | null;
}

const schema = new Schema<IExpense>(
  {
    fundId: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "bank", "online", "cheque", "other"],
    },
    date: { type: Date, required: true },
    vendor: { type: String, default: "" },
    reference: { type: String, default: "" },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

schema.index({ fundId: 1 });
schema.index({ date: 1 });
schema.index({ category: 1 });

export const Expense = mongoose.model<IExpense>("Expense", schema);
