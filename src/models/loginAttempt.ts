import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoginAttempt extends Document {
  key: string;
  count: number;
  windowStart: Date;
}

const schema = new Schema<ILoginAttempt>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    windowStart: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ key: 1 }, { unique: true });

export const LoginAttempt: Model<ILoginAttempt> =
  (mongoose.models.LoginAttempt as Model<ILoginAttempt>) ||
  mongoose.model<ILoginAttempt>("LoginAttempt", schema, "login_attempts");