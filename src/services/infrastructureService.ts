// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Infrastructure & 14-Lifeline Service
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import { InfrastructureItem, LifelineCategory } from '../types';
import { LocalStore } from '../lib/storage';

export const ALL_14_LIFELINES: LifelineCategory[] = [
  'Major Roads',
  'Highways',
  'Bridges',
  'Railways',
  'Hospitals',
  'Schools',
  'Power',
  'Telecommunications',
  'Water Supply',
  'Emergency Services',
  'Transport Hubs',
  'Government Facilities',
  'Evacuation / Access Routes',
  'Other Critical Public Infrastructure'
];

export class InfrastructureService {
  static getInfrastructure(): InfrastructureItem[] {
    return LocalStore.getInfrastructure();
  }

  static getByLocation(locationId: string): InfrastructureItem[] {
    return this.getInfrastructure().filter(i => i.location_id === locationId);
  }

  static getByCategory(category: LifelineCategory): InfrastructureItem[] {
    return this.getInfrastructure().filter(i => i.infrastructure_type === category);
  }

  /**
   * Prototype Dashboard Highlight Metrics:
   * 6 KEY BRIDGES TRACKED & 7 HEALTH HUBS TRACKED
   */
  static getHighlightMetrics(): {
    bridgesCount: number;
    healthHubsCount: number;
    totalLifelines: number;
    atRiskLifelines: number;
  } {
    const items = this.getInfrastructure();
    const bridges = items.filter(i => i.infrastructure_type === 'Bridges');
    const healthHubs = items.filter(i => i.infrastructure_type === 'Hospitals');
    const atRisk = items.filter(i => i.status === 'AT RISK' || i.status === 'RESTRICTED' || i.status === 'BLOCKED');

    return {
      bridgesCount: bridges.length,
      healthHubsCount: healthHubs.length,
      totalLifelines: items.length,
      atRiskLifelines: atRisk.length
    };
  }

  static get14LifelineBreakdown(): Array<{
    category: LifelineCategory;
    total: number;
    operational: number;
    atRisk: number;
  }> {
    const items = this.getInfrastructure();

    return ALL_14_LIFELINES.map(cat => {
      const filtered = items.filter(i => i.infrastructure_type === cat);
      const operational = filtered.filter(i => i.status === 'OPERATIONAL').length;
      const atRisk = filtered.filter(i => i.status !== 'OPERATIONAL').length;

      return {
        category: cat,
        total: filtered.length,
        operational,
        atRisk
      };
    });
  }
}
