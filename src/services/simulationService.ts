// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Simulation Engine
// Multi-Stage Deterioration Scenario for NH-10 Teesta Valley Corridor
// Strictly labeled: SIMULATED DEMONSTRATION DATA
// ==============================================================================

import { LocalStore, INITIAL_LOCATIONS, INITIAL_ALERTS } from '../lib/storage';
import { AlertService } from './alertService';

export interface SimulationStep {
  stage: number;
  title: string;
  description: string;
  rainfall: number;
  soil_moisture: number;
  risk_score: number;
  risk_level: 'HIGH' | 'CRITICAL';
  priority_score: number;
  road_status: 'RESTRICTED' | 'BLOCKED';
  alert_generated: boolean;
}

export const SIMULATION_STAGES: SimulationStep[] = [
  {
    stage: 1,
    title: 'Stage 1 — Environmental Conditions Deteriorating',
    description: 'Intense orographic cloudburst detected in upper Teesta watershed; precipitation accelerates from 184.5 mm/24h towards 215.0 mm/24h.',
    rainfall: 215.0,
    soil_moisture: 93.5,
    risk_score: 91,
    risk_level: 'CRITICAL',
    priority_score: 93,
    road_status: 'RESTRICTED',
    alert_generated: false
  },
  {
    stage: 2,
    title: 'Stage 2 — Soil Moisture Saturation Threshold Exceeded',
    description: 'Pore-water pressure spikes in slope regolith; soil moisture reaches critical saturation threshold of 95% along Birik Dara and 29th Mile.',
    rainfall: 232.0,
    soil_moisture: 95.8,
    risk_score: 94,
    risk_level: 'CRITICAL',
    priority_score: 96,
    road_status: 'RESTRICTED',
    alert_generated: false
  },
  {
    stage: 3,
    title: 'Stage 3 — Risk Score Climbs to Critical (96/100)',
    description: 'Multi-factor weighted engine elevates NH-10 Teesta Valley Corridor risk score to 96 (CRITICAL). Slope factor and saturation breach safety limits.',
    rainfall: 245.8,
    soil_moisture: 97.0,
    risk_score: 96,
    risk_level: 'CRITICAL',
    priority_score: 98,
    road_status: 'RESTRICTED',
    alert_generated: false
  },
  {
    stage: 4,
    title: 'Stage 4 — Infrastructure Impact Detected (NH-10 Blocked)',
    description: 'Debris flow and boulder avalanche breach rockfall barriers at KM 31. NH-10 corridor physically BLOCKED; access to Teesta Low Dam IV Span Bridge severed.',
    rainfall: 245.8,
    soil_moisture: 97.0,
    risk_score: 96,
    risk_level: 'CRITICAL',
    priority_score: 99,
    road_status: 'BLOCKED',
    alert_generated: false
  },
  {
    stage: 5,
    title: 'Stage 5 — Emergency Priority Escalated (99 / CRITICAL)',
    description: 'Priority Engine flags maximum response urgency (99/100). 18,500 residents cut off; Sikkim lifeline severed; diversion to Lava-Algarah activated.',
    rainfall: 245.8,
    soil_moisture: 97.0,
    risk_score: 96,
    risk_level: 'CRITICAL',
    priority_score: 99,
    road_status: 'BLOCKED',
    alert_generated: true
  }
];

export class SimulationService {
  static isSimulationActive(): boolean {
    return LocalStore.isSimulating();
  }

  static runSimulatedScenario(onStepUpdate?: (step: SimulationStep) => void): Promise<void> {
    LocalStore.setSimulationState(true);
    LocalStore.addAuditLog('SIMULATION_ENGINE', 'SIMULATION_SCENARIO_STARTED', {
      scenario: 'NH-10 Teesta Valley Extreme Deterioration',
      type: 'SIMULATED DEMONSTRATION DATA'
    });

    return new Promise((resolve) => {
      let currentStageIndex = 0;

      const interval = setInterval(() => {
        if (currentStageIndex >= SIMULATION_STAGES.length) {
          clearInterval(interval);
          resolve();
          return;
        }

        const step = SIMULATION_STAGES[currentStageIndex];

        // Update NH-10 Location in store
        LocalStore.updateLocation('11111111-1111-1111-1111-111111111111', {
          rainfall: step.rainfall,
          soil_moisture: step.soil_moisture,
          road_status: step.road_status
        });

        if (step.alert_generated) {
          // Check if already created
          const existing = AlertService.getAlerts().find(a => a.id === 'alt-sim-critical');
          if (!existing) {
            AlertService.createAlert({
              location_id: '11111111-1111-1111-1111-111111111111',
              location_name: 'NH-10 Teesta Valley Corridor',
              severity: 'CRITICAL',
              title: 'CRITICAL LANDSLIDE RISK — NH-10 TEESTA VALLEY CORRIDOR',
              message: 'SIMULATION ESCALATION: 245.8 mm rainfall and 97% soil moisture triggered severe slope breach at KM 31. Road blocked. Emergency diversion active.',
              trigger_reason: 'Rainfall 245.8 mm & soil moisture 97% exceeded critical limits during simulated scenario.',
              status: 'NEW',
              assigned_team: 'NDRF 2nd Battalion & Kalimpong SDRF Unit',
              exposed_population: 18500,
              affected_infrastructure: ['NH-10 Arterial (BLOCKED)', 'Teesta Low Dam IV Span Bridge (ISOLATED)', 'Birik Dara Gorge Bridge'],
              recommended_actions: [
                'IMMEDIATE: Halt all civilian vehicular movement at Rangpo and Melli checkposts',
                'Activate heavy PWD payloaders & earthmovers at 29th Mile for rock clearance',
                'Divert essential Sikkim freight via Gorubathan-Lava-Algarah State Highway',
                'Put Teesta Valley Sub-Divisional Emergency Health Hub on Level-1 mass casualty standby',
                'Mobilize NDRF swift water & mountain rescue boats along the lower Teesta channel'
              ]
            });
          }
        }

        if (onStepUpdate) {
          onStepUpdate(step);
        }

        currentStageIndex++;
      }, 700); // 700ms between visual stages for high-engagement live demonstration
    });
  }

  static resetSimulation() {
    LocalStore.setSimulationState(false);

    // Reset NH-10 back to baseline demonstration values
    const originalNH10 = INITIAL_LOCATIONS.find(l => l.id === '11111111-1111-1111-1111-111111111111');
    if (originalNH10) {
      LocalStore.updateLocation('11111111-1111-1111-1111-111111111111', {
        rainfall: originalNH10.rainfall,
        soil_moisture: originalNH10.soil_moisture,
        road_status: originalNH10.road_status
      });
    }

    // Reset alerts to initial state
    LocalStore.saveAlerts(INITIAL_ALERTS);

    LocalStore.addAuditLog('SIMULATION_ENGINE', 'SIMULATION_SCENARIO_RESET', {
      scenario: 'NH-10 Teesta Valley Corridor restored to baseline demonstration state (Risk 88, Rain 184.5mm, Soil Moisture 91%)'
    });
  }
}
