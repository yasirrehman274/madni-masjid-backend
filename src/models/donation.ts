import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  fundId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  date: Date;
  reference: string;
  notes: string;
  receiptId: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId | null;
}

const schema = new Schema<IDonation>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    fundId: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "bank", "online", "cheque", "other"],
    },
    date: { type: Date, required: true },
    reference: { type: String, default: "" },
    notes: { type: String, default: "" },
    receiptId: { type: Schema.Types.ObjectId, ref: "Receipt", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

schema.index({ donorId: 1 });
schema.index({ fundId: 1 });
schema.index({ date: 1 });

export const Donation = mongoose.model<IDonation>("Donation", schema);
