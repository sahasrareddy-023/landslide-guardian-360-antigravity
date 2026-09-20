// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 3: Risk Analysis Engine
// Transparent Demonstration Weighted Matrix & Future AI/ML API Contract
// ==============================================================================

import React, { useState } from 'react';
import { 
  Flame, 
  Cpu, 
  Sliders, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  CloudRain, 
  Droplets, 
  Mountain, 
  History, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { LocationRecord, RiskLevel, MLPredictRequest, MLPredictResponse } from '../types';
import { LocationService } from '../services/locationService';
import { RiskService } from '../services/riskService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

interface Props {
  selectedLocationId?: string;
}

export const RiskPage: React.FC<Props> = ({ selectedLocationId }) => {
  const locations = LocationService.getLocations();
  const [activeLocationId, setActiveLocationId] = useState<string>(
    selectedLocationId || locations[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'transparent' | 'future_ml'>('transparent');

  const selectedLocation = locations.find(l => l.id === activeLocationId) || locations[0];
  const prediction = selectedLocation ? RiskService.getPredictionForLocation(selectedLocation) : null;

  // Future ML Interactive Test State
  const [testRainfall, setTestRainfall] = useState(210);
  const [testMoisture, setTestMoisture] = useState(94);
  const [testSlope, setTestSlope] = useState(42);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlResponse, setMlResponse] = useState<MLPredictResponse | null>(null);

  const handleTestML = async () => {
    setMlLoading(true);
    const payload: MLPredictRequest = {
      location_id: selectedLocation.id,
      rainfall: testRainfall,
      soil_moisture: testMoisture,
      slope: testSlope,
      historical_features: {
        incident_count_10y: 4,
        mean_precipitation_monsoon: 2850,
        lithology_index: 0.88
      },
      exposure_features: {
        population: selectedLocation.exposed_population,
        vital_corridor: true
      }
    };

    const res = await RiskService.predictFutureML(payload);
    setMlResponse(res);
    setMlLoading(false);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH': return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border-amber-800';
      default: return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-950/80 border border-orange-800/60 text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              LANDSLIDE RISK ANALYSIS ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Transparent Multi-Factor Formulation // Future Machine Learning Contract
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="AI/ML MODEL: DEMONSTRATION ENGINE" />
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
        </div>
      </div>

      {/* Corridor Selector & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0C1322] border border-slate-800 p-3 rounded-xl">
        {/* Location Dropdown */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 uppercase font-bold">Corridor:</span>
          <select
            value={activeLocationId}
            onChange={(e) => setActiveLocationId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-cyan-300 font-semibold rounded px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.state})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('transparent')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'transparent'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Transparent Formulation
          </button>
          <button
            onClick={() => setActiveTab('future_ml')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'future_ml'
                ? 'bg-purple-950 text-purple-300 font-bold border border-purple-700/60 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Future AI/ML Architecture
          </button>
        </div>
      </div>

      {activeTab === 'transparent' ? (
        /* TAB 1: TRANSPARENT DEMONSTRATION WEIGHTED MATRIX */
        <div className="space-y-6">
          {/* Main Risk Overview Banner */}
          {prediction && selectedLocation && (
            <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Score Gauge */}
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    PREDICTED SUSCEPTIBILITY
                  </span>
                  <div className="flex items-baseline gap-3 justify-center md:justify-start">
                    <span className="text-6xl font-mono font-extrabold text-white">
                      {prediction.risk_score}
                    </span>
                    <span className="text-xl font-mono text-slate-500 font-bold">/ 100</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getRiskBadge(prediction.risk_level)}`}>
                      {prediction.risk_level} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Model: {prediction.model_version} • Confidence: {(prediction.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                {/* Mathematical Formula Preview */}
                <div className="md:col-span-2 bg-[#070B13] p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Sliders className="w-4 h-4" />
                      TRANSPARENT WEIGHTED CALCULATION FORMULA
                    </span>
                    <span className="text-[10px] text-amber-400">EXPLAINABLE DEMO ENGINE</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800/80">
                    <span className="text-cyan-300">Risk Score</span> = (Rainfall &times; 35%) + (Soil Saturation &times; 30%) + (Slope Gradient &times; 20%) + (Historical Baseline &times; 10%) + (Terrain Geotech &times; 5%)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Weights reflect empirical hazard contribution during the Himalayan monsoon window.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contributing Factors Decomposition */}
          {prediction && (
            <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                CONTRIBUTING RISK FACTORS DECOMPOSITION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* 1. Rainfall */}
                <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <CloudRain className="w-4 h-4" /> Rainfall
                    </span>
                    <span className="text-white font-bold">{prediction.contributing_factors.rainfall_factor} / 35 pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${(prediction.contributing_factors.rainfall_factor / 35) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Current: <strong>{selectedLocation.rainfall} mm/24h</strong> (Threshold: 150mm)
                  </div>
                </div>

                {/* 2. Soil Moisture */}
                <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Droplets className="w-4 h-4" /> Soil Saturation
                    </span>
                    <span className="text-white font-bold">{prediction.contributing_factors.soil_moisture_factor} / 30 pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${(prediction.contributing_factors.soil_moisture_factor / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Current: <strong>{selectedLocation.soil_moisture}%</strong> (Critical: 90%)
                  </div>
                </div>

                {/* 3. Slope */}
                <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Mountain className="w-4 h-4" /> Slope Angle
                    </span>
                    <span className="text-white font-bold">{prediction.contributing_factors.slope_factor} / 20 pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${(prediction.contributing_factors.slope_factor / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Inclination: <strong>{selectedLocation.slope}°</strong> (Steep escarpment)
                  </div>
                </div>

                {/* 4. Historical Events */}
                <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                      <History className="w-4 h-4" /> Historical
                    </span>
                    <span className="text-white font-bold">{prediction.contributing_factors.historical_factor} / 10 pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${(prediction.contributing_factors.historical_factor / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Baseline: <strong>{selectedLocation.baseline_risk}</strong> susceptibility
                  </div>
                </div>

                {/* 5. Terrain Geology */}
                <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-sky-400 font-bold">
                      <ShieldAlert className="w-4 h-4" /> Lithology
                    </span>
                    <span className="text-white font-bold">{prediction.contributing_factors.terrain_factor} / 5 pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all"
                      style={{ width: `${(prediction.contributing_factors.terrain_factor / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate" title={selectedLocation.terrain_type}>
                    {selectedLocation.terrain_type}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: FUTURE AI/ML ARCHITECTURE & API CONTRACT */
        <div className="space-y-6">
          {/* API Contract Specification Card */}
          <div className="bg-[#0C1322] border border-purple-500/40 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  FUTURE AI/ML INFERENCE ARCHITECTURE CONTRACT (POST /api/risk/predict)
                </h3>
              </div>
              <DataHonestyBadge type="FUTURE INTEGRATION" size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with SIH26001 specifications, the backend architecture provides a strict REST/FastAPI 
              contract allowing any trained neural network, XGBoost, or physical hydrological model to be plugged into 
              the platform without changing frontend code.
            </p>

            {/* Code Contract Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#070B13] p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-purple-300 font-bold">REQUEST CONTRACT (JSON Payload):</div>
                <pre className="text-slate-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded">
{`POST /api/risk/predict
Content-Type: application/json

{
  "location_id": "${selectedLocation.id}",
  "rainfall": 210.0,
  "soil_moisture": 94.0,
  "slope": 42.0,
  "historical_features": {
    "incident_count_10y": 4,
    "mean_precipitation_monsoon": 2850.0,
    "lithology_index": 0.88
  },
  "exposure_features": {
    "population": ${selectedLocation.exposed_population},
    "vital_corridor": true
  }
}`}
                </pre>
              </div>

              <div className="bg-[#070B13] p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-cyan-300 font-bold">RESPONSE CONTRACT (JSON Response):</div>
                <pre className="text-slate-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded">
{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "risk_score": 96,
  "risk_level": "CRITICAL",
  "confidence": 0.91,
  "contributing_factors": {
    "rainfall_factor": 32,
    "soil_moisture_factor": 29,
    "slope_factor": 18,
    "historical_factor": 8,
    "terrain_factor": 4
  },
  "model_version": "PRODUCTION FASTAPI ARCHITECTURE",
  "prediction_time": "2026-09-20T11:00:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Interactive ML Test Harness */}
          <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              INTERACTIVE AI/ML TEST HARNESS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Test Rainfall (mm/24h): <strong className="text-cyan-300">{testRainfall}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={testRainfall}
                  onChange={(e) => setTestRainfall(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Test Soil Moisture (%): <strong className="text-amber-300">{testMoisture}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={testMoisture}
                  onChange={(e) => setTestMoisture(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Test Slope Gradient (°): <strong className="text-emerald-300">{testSlope}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={testSlope}
                  onChange={(e) => setTestSlope(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleTestML}
              disabled={mlLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{mlLoading ? 'INVOKING INFERENCE...' : 'TEST INFERENCE API CONTRACT'}</span>
            </button>

            {mlResponse && (
              <div className="p-4 bg-[#070B13] border border-slate-800 rounded-lg space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> INFERENCE RETURNED SUCCESSFULLY
                  </span>
                  <span className="text-slate-400">{mlResponse.prediction_time}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 bg-slate-900 rounded">
                    <span className="text-slate-400">RISK SCORE:</span>
                    <div className="text-lg font-bold text-white">{mlResponse.risk_score} / 100</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded">
                    <span className="text-slate-400">LEVEL:</span>
                    <div className="text-lg font-bold text-rose-400">{mlResponse.risk_level}</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded">
                    <span className="text-slate-400">CONFIDENCE:</span>
                    <div className="text-lg font-bold text-cyan-400">{(mlResponse.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div className="p-2 bg-slate-900 rounded">
                    <span className="text-slate-400">ENGINE:</span>
                    <div className="text-xs font-bold text-purple-300 truncate">{mlResponse.model_version}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
