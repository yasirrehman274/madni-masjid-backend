import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConstructionProject extends Document {
  name: string;
  description: string;
  estimatedBudget: number;
  status: string;
  startDate?: Date;
  targetDate?: Date;
  notes: string;
}

const schema = new Schema<IConstructionProject>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    estimatedBudget: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["planning", "in_progress", "completed", "on_hold", "cancelled"],
      default: "planning",
    },
    startDate: { type: Date },
    targetDate: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ConstructionProject: Model<IConstructionProject> =
  (mongoose.models.ConstructionProject as Model<IConstructionProject>) ||
  mongoose.model<IConstructionProject>("ConstructionProject", schema, "construction_projects");
