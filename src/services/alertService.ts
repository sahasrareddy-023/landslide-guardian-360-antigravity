// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Alert Lifecycle Service
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import { AlertItem, AlertStatus, RiskLevel } from '../types';
import { LocalStore } from '../lib/storage';

export class AlertService {
  static getAlerts(): AlertItem[] {
    return LocalStore.getAlerts();
  }

  static getAlertById(id: string): AlertItem | undefined {
    return this.getAlerts().find(a => a.id === id);
  }

  static getActiveAlerts(): AlertItem[] {
    return this.getAlerts().filter(a => a.status === 'NEW' || a.status === 'ACKNOWLEDGED' || a.status === 'IN_PROGRESS');
  }

  static getAlertsBySeverity(severity: RiskLevel): AlertItem[] {
    return this.getAlerts().filter(a => a.severity === severity);
  }

  static updateAlertStatus(id: string, status: AlertStatus, user: string = 'SYSTEM_OPERATOR'): AlertItem | null {
    return LocalStore.updateAlertStatus(id, status, user);
  }

  static createAlert(alertData: Omit<AlertItem, 'id' | 'created_at'>): AlertItem {
    const newAlert: AlertItem = {
      ...alertData,
      id: 'alt-' + Math.random().toString(36).substring(2, 8),
      created_at: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Alert created by Demonstration Early Warning Engine',
          user: 'SYSTEM_RISK_ENGINE'
        }
      ]
    };
    LocalStore.addAlert(newAlert);
    return newAlert;
  }
}
