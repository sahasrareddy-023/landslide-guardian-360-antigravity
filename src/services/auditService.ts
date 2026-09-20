// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Audit Log Service
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import { AuditLog } from '../types';
import { LocalStore } from '../lib/storage';

export class AuditService {
  static getAuditLogs(): AuditLog[] {
    return LocalStore.getAuditLogs();
  }

  static logAction(userId: string, actionType: string, details: Record<string, any>) {
    LocalStore.addAuditLog(userId, actionType, details);
  }
}
