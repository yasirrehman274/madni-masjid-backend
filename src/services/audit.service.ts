import { AuditLog, IAuditLog } from "../models/auditLog";

export async function createAuditLog(data: Partial<IAuditLog>) {
  return AuditLog.create(data);
}

export async function getAuditLogs(
  filter: Record<string, any> = {},
  pagination: { page: number; limit: number; skip: number }
) {
  const { page, limit, skip } = pagination;
  const query: Record<string, any> = {};

  if (filter.entity) query.entity = filter.entity;
  if (filter.action) query.action = filter.action;
  if (filter.userId) query.userId = filter.userId;
  if (filter.from || filter.to) {
    query.createdAt = {};
    if (filter.from) query.createdAt.$gte = new Date(filter.from);
    if (filter.to) query.createdAt.$lte = new Date(filter.to);
  }

  const [data, total] = await Promise.all([
    AuditLog.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    AuditLog.countDocuments(query),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function clearAuditLogs() {
  return AuditLog.deleteMany({});
}
