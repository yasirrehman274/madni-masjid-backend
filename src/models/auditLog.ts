import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  entity: string;
  entityId: string;
  description: string;
  userId: mongoose.Types.ObjectId | null;
  userName: string;
  metadata: any;
}

const schema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "login", "logout", "restore", "backup", "other"],
    },
    entity: {
      type: String,
      required: true,
      enum: ["fund", "donor", "donation", "expense", "construction", "madrasa", "receipt", "user", "settings", "auth"],
    },
    entityId: { type: String, default: "" },
    description: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userName: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

schema.index({ createdAt: 1 });
schema.index({ entity: 1 });
schema.index({ action: 1 });
schema.index({ userId: 1 });

export const AuditLog = mongoose.model<IAuditLog>(
  "AuditLog",
  schema,
  "audit_logs"
);
