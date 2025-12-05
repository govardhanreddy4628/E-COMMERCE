import mongoose, { Schema, Types } from "mongoose";

const auditLogSchema = new Schema(
  {
    entity: { type: String, required: true }, // "category", "product", etc.
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true }, // "update", "create", "delete"
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    changes: Schema.Types.Mixed, // { oldValue, newValue }
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);
