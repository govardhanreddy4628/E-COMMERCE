import AuditLog from "../models/AuditLog";

export const addAuditLog = async ({
  entity,
  entityId,
  action,
  userId,
  changes,
}: {
  entity: string;
  entityId: string;
  action: string;
  userId?: string;
  changes?: any;
}) => {
  await AuditLog.create({
    entity,
    entityId,
    action,
    userId,
    changes,
  });
};
