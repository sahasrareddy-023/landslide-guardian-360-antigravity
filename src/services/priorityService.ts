// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Emergency Response Prioritisation Service
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import { LocationRecord, PriorityAssessment, PriorityLevel } from '../types';
import { RiskService } from './riskService';
import { InfrastructureService } from './infrastructureService';
import { LocalStore } from '../lib/storage';

export class PriorityService {
  /**
   * Calculates Emergency Response Priority for a given location.
   * Multi-factor formula:
   * - Risk Hazard Weight: 40%
   * - Road Disruption Weight: 25%
   * - Population Exposure Weight: 20%
   * - Critical Lifelines (Health Hubs / Bridges) Weight: 15%
   */
  static assessPriority(location: LocationRecord): PriorityAssessment {
    const riskPred = RiskService.getPredictionForLocation(location);
    const infraItems = InfrastructureService.getByLocation(location.id);

    const bridgesAtRisk = infraItems.filter(i => i.infrastructure_type === 'Bridges' && i.status !== 'OPERATIONAL').length;
    const hospitalsPresent = infraItems.filter(i => i.infrastructure_type === 'Hospitals').length;

    // 1. Hazard severity component (0 - 40 pts)
    const hazardPts = (riskPred.risk_score / 100) * 40;

    // 2. Road status component (0 - 25 pts)
    let roadPts = 5;
    if (location.road_status === 'BLOCKED') roadPts = 25;
    else if (location.road_status === 'CRITICAL') roadPts = 23;
    else if (location.road_status === 'RESTRICTED') roadPts = 15;
    else roadPts = 5;

    // 3. Population exposure component (0 - 20 pts)
    const popPts = Math.min((location.exposed_population / 25000) * 20, 20);

    // 4. Lifeline impact component (0 - 15 pts)
    const lifelinePts = Math.min((bridgesAtRisk * 4) + (hospitalsPresent * 3) + (location.substations_count * 2), 15);

    const totalPriority = Math.min(Math.round(hazardPts + roadPts + popPts + lifelinePts), 100);

    let priority_level: PriorityLevel = 'LOW';
    if (totalPriority >= 85) priority_level = 'CRITICAL';
    else if (totalPriority >= 65) priority_level = 'HIGH';
    else if (totalPriority >= 40) priority_level = 'MEDIUM';
    else priority_level = 'LOW';

    // Generate clear, jury-friendly human explanation
    let explanation = '';
    if (totalPriority >= 85) {
      explanation = `Priority Score: ${totalPriority} (${priority_level}) — High hazard severity (Risk Score ${riskPred.risk_score}) + major arterial connectivity disruption (${location.road_status}) on vital lifeline ${location.primary_lifeline} + high population exposure (${location.exposed_population.toLocaleString()} citizens across ${location.villages_count} settlements) + critical vulnerability to ${location.bridges_count} bridges & emergency health hub.`;
    } else if (totalPriority >= 65) {
      explanation = `Priority Score: ${totalPriority} (${priority_level}) — Elevated hazard indicators (Risk Score ${riskPred.risk_score}) combined with ${location.road_status.toLowerCase()} transit along ${location.road_name}; active monitoring and pre-emptive staging required.`;
    } else {
      explanation = `Priority Score: ${totalPriority} (${priority_level}) — Moderate risk profile (Risk Score ${riskPred.risk_score}); lifelines operational with routine drone/patrol surveillance recommended.`;
    }

    // Recommended response dispatch actions
    const recommended_dispatch: string[] = [];
    if (totalPriority >= 85) {
      recommended_dispatch.push(`Deploy SDRF / NDRF heavy mountain rescue battalion to ${location.name}`);
      recommended_dispatch.push(`Activate alternate transit route: ${location.alternate_route || 'Regional bypass'}`);
      recommended_dispatch.push(`Mobilize PWD hydraulic excavators & stone-clearing payloaders at strategic mileposts`);
      recommended_dispatch.push(`Place ${location.hospitals_count} Regional Health Hub(s) on Tier-1 trauma standby with auxiliary oxygen`);
      recommended_dispatch.push(`Issue bilingual public alert to ${location.exposed_population.toLocaleString()} residents in ${location.villages_count} villages`);
    } else if (totalPriority >= 65) {
      recommended_dispatch.push(`Establish 24/7 patrol checkpost along ${location.road_name}`);
      recommended_dispatch.push(`Deploy laser extensometers and tilt gauges on vulnerable slopes`);
      recommended_dispatch.push(`Pre-position earthmoving equipment within 15km perimeter`);
    } else {
      recommended_dispatch.push(`Standard automatic telemetry logging (15-min interval)`);
      recommended_dispatch.push(`Maintain inter-agency emergency radio link check`);
    }

    return {
      location_id: location.id,
      location_name: location.name,
      priority_score: totalPriority,
      priority_level,
      risk_score: riskPred.risk_score,
      exposed_population: location.exposed_population,
      critical_lifelines_count: infraItems.length,
      road_status: location.road_status,
      accessibility_score: location.road_status === 'BLOCKED' ? 20 : location.road_status === 'RESTRICTED' ? 55 : 95,
      explanation,
      recommended_dispatch
    };
  }

  static getAllPriorities(): PriorityAssessment[] {
    const locations = LocalStore.getLocations();
    return locations
      .map(loc => this.assessPriority(loc))
      .sort((a, b) => b.priority_score - a.priority_score);
  }
}
