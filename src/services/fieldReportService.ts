// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Community & Field Reporting Service
// Supports Low-Network / Offline-First Queuing and Synchronization
// ==============================================================================

import { FieldReport, FieldReportCategory, RiskLevel, RoadStatus, SyncStatus } from '../types';
import { LocalStore } from '../lib/storage';

export class FieldReportService {
  static getFieldReports(): FieldReport[] {
    return LocalStore.getFieldReports();
  }

  static getPendingCount(): number {
    return this.getFieldReports().filter(
      r => r.sync_status === 'PENDING SYNC' || r.sync_status === 'RETRY'
    ).length;
  }

  static submitReport(data: {
    location_id?: string;
    location_name?: string;
    reporter_id: string;
    report_type: FieldReportCategory;
    description: string;
    latitude: number;
    longitude: number;
    media_url?: string;
    severity: RiskLevel;
    road_condition: RoadStatus;
  }): FieldReport {
    const isOffline = LocalStore.isOfflineSimulated() || !navigator.onLine;
    const sync_status: SyncStatus = isOffline ? 'PENDING SYNC' : 'SYNCED';

    const newReport: FieldReport = {
      id: 'fr-' + Math.random().toString(36).substring(2, 8),
      location_id: data.location_id,
      location_name: data.location_name,
      reporter_id: data.reporter_id || 'CITIZEN_REPORTER',
      report_type: data.report_type,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      media_url: data.media_url,
      severity: data.severity,
      road_condition: data.road_condition,
      status: 'SUBMITTED',
      sync_status,
      created_at: new Date().toISOString()
    };

    LocalStore.addFieldReport(newReport);
    return newReport;
  }

  static triggerManualSync(): { syncedCount: number } {
    const syncedCount = LocalStore.syncPendingReports();
    return { syncedCount };
  }

  static toggleOfflineSimulation(enable: boolean) {
    LocalStore.setOfflineSimulated(enable);
  }

  static isOfflineSimulated(): boolean {
    return LocalStore.isOfflineSimulated();
  }
}
