import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  mosqueName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  dateFormat: string;
}

const schema = new Schema<ISettings>(
  {
    mosqueName: { type: String, default: "Madni Masjid" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    currency: { type: String, default: "PKR" },
    dateFormat: { type: String, default: "dd MMM yyyy" },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  (mongoose.models.Settings as Model<ISettings>) || mongoose.model<ISettings>("Settings", schema);
