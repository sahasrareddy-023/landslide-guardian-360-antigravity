// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Risk Service
// Transparent Demonstration Risk Engine & Future AI/ML API Contract
// ==============================================================================

import {
  LocationRecord,
  RiskLevel,
  RiskPrediction,
  ContributingFactors,
  MLPredictRequest,
  MLPredictResponse
} from '../types';
import { LocalStore } from '../lib/storage';

export class RiskService {
  /**
   * Transparent Demonstration Risk Calculation Formula:
   * Score = (Rainfall * 0.35) + (Soil Moisture * 0.30) + (Slope * 0.20) + (Historical * 0.10) + (Terrain * 0.05)
   * All factors scaled to 0-100 before weighting.
   */
  static calculateDemonstrationRisk(
    rainfall: number,      // mm/24h (0 - 300)
    soilMoisture: number,  // percentage (0 - 100)
    slope: number,         // degrees (0 - 60)
    baselineRisk: RiskLevel = 'MEDIUM',
    terrainType: string = ''
  ): { risk_score: number; risk_level: RiskLevel; contributing_factors: ContributingFactors } {
    // 1. Rainfall factor (0 - 35 points max)
    const normalizedRain = Math.min(rainfall / 250, 1.0);
    const rainfallFactor = Math.round(normalizedRain * 35);

    // 2. Soil Moisture factor (0 - 30 points max)
    const normalizedMoisture = Math.min(soilMoisture / 100, 1.0);
    const moistureFactor = Math.round(normalizedMoisture * 30);

    // 3. Slope factor (0 - 20 points max, steep slopes > 35° are high risk)
    const normalizedSlope = Math.min(Math.max(slope, 0) / 50, 1.0);
    const slopeFactor = Math.round(normalizedSlope * 20);

    // 4. Historical baseline factor (0 - 10 points max)
    let histFactor = 5;
    if (baselineRisk === 'CRITICAL') histFactor = 10;
    else if (baselineRisk === 'HIGH') histFactor = 8;
    else if (baselineRisk === 'MEDIUM') histFactor = 5;
    else histFactor = 2;

    // 5. Terrain factor (0 - 5 points max)
    let terrainFactor = 3;
    if (terrainType.toLowerCase().includes('escarpment') || terrainType.toLowerCase().includes('debris')) {
      terrainFactor = 5;
    } else if (terrainType.toLowerCase().includes('granitic')) {
      terrainFactor = 2;
    }

    const totalScore = Math.min(
      Math.max(rainfallFactor + moistureFactor + slopeFactor + histFactor + terrainFactor, 0),
      100
    );

    let risk_level: RiskLevel = 'LOW';
    if (totalScore >= 90) risk_level = 'CRITICAL';
    else if (totalScore >= 70) risk_level = 'HIGH';
    else if (totalScore >= 45) risk_level = 'MEDIUM';
    else risk_level = 'LOW';

    return {
      risk_score: totalScore,
      risk_level,
      contributing_factors: {
        rainfall_factor: rainfallFactor,
        soil_moisture_factor: moistureFactor,
        slope_factor: slopeFactor,
        historical_factor: histFactor,
        terrain_factor: terrainFactor
      }
    };
  }

  /**
   * Get Current Risk Prediction for a given Location
   */
  static getPredictionForLocation(location: LocationRecord): RiskPrediction {
    const calc = this.calculateDemonstrationRisk(
      location.rainfall,
      location.soil_moisture,
      location.slope,
      location.baseline_risk,
      location.terrain_type
    );

    return {
      id: `pred-${location.id.substring(0, 8)}`,
      location_id: location.id,
      location_name: location.name,
      risk_score: calc.risk_score,
      risk_level: calc.risk_level,
      confidence: 0.88,
      contributing_factors: calc.contributing_factors,
      model_version: 'DEMONSTRATION ENGINE v1.2 (RULE-BASED WEIGHTED MATRIX)',
      prediction_time: location.updated_at || new Date().toISOString()
    };
  }

  /**
   * Future AI/ML API Contract Handler
   * Simulates calling `POST /api/risk/predict`
   */
  static async predictFutureML(payload: MLPredictRequest): Promise<MLPredictResponse> {
    // If Express backend is running, try calling the actual API endpoint
    try {
      const res = await fetch('/api/risk/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fall back to demonstration engine
    }

    const calc = this.calculateDemonstrationRisk(payload.rainfall, payload.soil_moisture, payload.slope);
    return {
      risk_score: calc.risk_score,
      risk_level: calc.risk_level,
      confidence: 0.89,
      contributing_factors: calc.contributing_factors,
      model_version: 'AI/ML MODEL: DEMONSTRATION ENGINE (FUTURE FASTAPI CONTRACT READY)',
      prediction_time: new Date().toISOString()
    };
  }
}
