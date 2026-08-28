import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReceipt extends Document {
  receiptNumber: string;
  donationId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  fundId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  date: Date;
  issuedBy: mongoose.Types.ObjectId | null;
}

const schema = new Schema<IReceipt>(
  {
    receiptNumber: { type: String, required: true, unique: true },
    donationId: { type: Schema.Types.ObjectId, ref: "Donation", required: true },
    donorId: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    fundId: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

schema.index({ receiptNumber: 1 }, { unique: true });
schema.index({ donationId: 1 });

export const Receipt: Model<IReceipt> =
  (mongoose.models.Receipt as Model<IReceipt>) || mongoose.model<IReceipt>("Receipt", schema);
