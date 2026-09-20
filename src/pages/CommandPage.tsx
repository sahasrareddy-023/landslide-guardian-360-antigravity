// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 1: Command Center Dashboard
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Activity, 
  CloudRain, 
  Droplets, 
  Car, 
  Zap, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { LocationRecord, AlertItem, PriorityAssessment } from '../types';
import { LocationService } from '../services/locationService';
import { InfrastructureService } from '../services/infrastructureService';
import { AlertService } from '../services/alertService';
import { FieldReportService } from '../services/fieldReportService';
import { PriorityService } from '../services/priorityService';
import { RiskService } from '../services/riskService';
import { SimulationBanner } from '../components/simulation/SimulationBanner';
import { SimulationService } from '../services/simulationService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

interface Props {
  onNavigate: (module: any, locationId?: string) => void;
}

export const CommandPage: React.FC<Props> = ({ onNavigate }) => {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityAssessment[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const refreshData = () => {
    const locs = LocationService.getLocations();
    setLocations(locs);
    setAlerts(AlertService.getAlerts());
    setPriorities(PriorityService.getAllPriorities());
    setIsSimulating(SimulationService.isSimulationActive());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute KPI aggregations
  const totalMonitored = locations.length;
  const activeAlerts = alerts.filter(a => a.status === 'NEW' || a.status === 'ACKNOWLEDGED' || a.status === 'IN_PROGRESS');
  
  let criticalLocationsCount = 0;
  let highRiskLocationsCount = 0;
  let totalExposedPopulation = 0;
  let highestRiskScore = 0;

  locations.forEach(l => {
    const pred = RiskService.getPredictionForLocation(l);
    if (pred.risk_level === 'CRITICAL') criticalLocationsCount++;
    else if (pred.risk_level === 'HIGH') highRiskLocationsCount++;
    totalExposedPopulation += l.exposed_population;
    if (pred.risk_score > highestRiskScore) highestRiskScore = pred.risk_score;
  });

  const highlightMetrics = InfrastructureService.getHighlightMetrics();
  const roadSummary = LocationService.getRoadConnectivitySummary();
  const openFieldReports = FieldReportService.getFieldReports().filter(r => r.status === 'SUBMITTED').length;

  // Primary Demonstration Location: NH-10 Teesta Valley Corridor
  const nh10Location = locations.find(l => l.id === '11111111-1111-1111-1111-111111111111') || locations[0];
  const nh10Risk = nh10Location ? RiskService.getPredictionForLocation(nh10Location) : null;
  const nh10Priority = nh10Location ? PriorityService.assessPriority(nh10Location) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. SIMULATED SCENARIO BANNER (Top Priority Demo Action) */}
      <SimulationBanner
        isSimulatingActive={isSimulating}
        onSimulationComplete={refreshData}
        onSimulationReset={refreshData}
      />

      {/* 2. OPERATIONAL KPI MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              EXECUTIVE OPERATIONAL KPIS // NER TERRITORIAL COMMAND
            </h3>
          </div>
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* KPI 1 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Monitored Zones
            </div>
            <div className="text-2xl font-mono font-extrabold text-white mt-1">
              {totalMonitored}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">NER Strategic</div>
          </div>

          {/* KPI 2 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Active Alerts
            </div>
            <div className="text-2xl font-mono font-extrabold text-rose-400 mt-1">
              {activeAlerts.length}
            </div>
            <div className="text-[10px] text-rose-300 font-mono mt-0.5 animate-pulse">Early Warning</div>
          </div>

          {/* KPI 3 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Critical Zones
            </div>
            <div className="text-2xl font-mono font-extrabold text-rose-500 mt-1">
              {criticalLocationsCount}
            </div>
            <div className="text-[10px] text-rose-400 font-mono mt-0.5">Score &ge; 90</div>
          </div>

          {/* KPI 4 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              High-Risk Zones
            </div>
            <div className="text-2xl font-mono font-extrabold text-orange-400 mt-1">
              {highRiskLocationsCount}
            </div>
            <div className="text-[10px] text-orange-300 font-mono mt-0.5">Score 70–89</div>
          </div>

          {/* KPI 5 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Infra At Risk
            </div>
            <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
              {highlightMetrics.atRiskLifelines}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">of {highlightMetrics.totalLifelines} Lifelines</div>
          </div>

          {/* KPI 6 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Exposed Pop
            </div>
            <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-1">
              {(totalExposedPopulation / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Citizens Tracked</div>
          </div>

          {/* KPI 7 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Field Reports
            </div>
            <div className="text-2xl font-mono font-extrabold text-sky-400 mt-1">
              {openFieldReports}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Citizen/Ranger</div>
          </div>

          {/* KPI 8 */}
          <div className="bg-[#0C1322] border border-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Highest Risk
            </div>
            <div className="text-2xl font-mono font-extrabold text-rose-400 mt-1">
              {highestRiskScore}
            </div>
            <div className="text-[10px] text-rose-300 font-mono mt-0.5">NH-10 Sector</div>
          </div>
        </div>
      </div>

      {/* 3. QUICK STATUS STRIP (Road Connectivity, Rainfall, Moisture, Emergency Priority) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Road Connectivity Status */}
        <div 
          onClick={() => onNavigate('IMPACT')}
          className="bg-[#0C1322] border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Car className="w-4 h-4 text-cyan-400" />
              Road Connectivity
            </span>
            <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-lg font-mono font-extrabold ${
              roadSummary.blocked > 0 ? 'text-rose-400' : roadSummary.restricted > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {roadSummary.blocked > 0 ? `${roadSummary.blocked} BLOCKED` : `${roadSummary.restricted} RESTRICTED`}
            </span>
            <span className="text-xs font-mono text-slate-400">{roadSummary.open} Open</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
            Arterial: {nh10Location?.road_name} ({nh10Location?.road_status})
          </p>
        </div>

        {/* 24h Rainfall Status */}
        <div 
          onClick={() => onNavigate('RISK')}
          className="bg-[#0C1322] border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              Rainfall Status
            </span>
            <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-cyan-300">
              {nh10Location?.rainfall} mm/24h
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">THRESHOLD BREACH</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
            Peak: Teesta Valley Corridor watershed
          </p>
        </div>

        {/* Soil Moisture Status */}
        <div 
          onClick={() => onNavigate('RISK')}
          className="bg-[#0C1322] border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Droplets className="w-4 h-4 text-amber-400" />
              Soil Moisture Status
            </span>
            <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-amber-300">
              {nh10Location?.soil_moisture}% Saturation
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">
              {nh10Location && nh10Location.soil_moisture >= 95 ? 'PORE CRITICAL' : 'SATURATED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
            Slope regolith waterlogged at 42° gradient
          </p>
        </div>

        {/* Emergency Priority */}
        <div 
          onClick={() => onNavigate('PRIORITY')}
          className="bg-[#0C1322] border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Zap className="w-4 h-4 text-rose-400" />
              Emergency Priority
            </span>
            <span className="text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-rose-400">
              {nh10Priority?.priority_score} / 100
            </span>
            <span className="text-xs font-mono text-rose-300 font-bold">
              {nh10Priority?.priority_level}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
            Top Dispatch: NH-10 Teesta Corridor
          </p>
        </div>
      </div>

      {/* 4. PRIMARY DEMO SPOTLIGHT: NH-10 TEESTA VALLEY CORRIDOR (Section 6 Requirements) */}
      {nh10Location && nh10Risk && nh10Priority && (
        <div className="bg-[#0C1322] border border-cyan-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
                  PRIMARY DEMONSTRATION LOCATION
                </span>
                <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {nh10Location.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {nh10Location.state} • {nh10Location.district} District • {nh10Location.terrain_type}
              </p>
            </div>

            {/* Risk & Priority Pills */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg bg-rose-950/80 border border-rose-700/80 text-center">
                <div className="text-[10px] font-mono text-rose-300 uppercase">Risk Score</div>
                <div className="text-2xl font-mono font-extrabold text-rose-400">
                  {nh10Risk.risk_score} <span className="text-xs text-rose-300">({nh10Risk.risk_level})</span>
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-cyan-950/80 border border-cyan-700/80 text-center">
                <div className="text-[10px] font-mono text-cyan-300 uppercase">Priority Score</div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400">
                  {nh10Priority.priority_score} <span className="text-xs text-cyan-300">({nh10Priority.priority_level})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Baseline Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">24H RAINFALL</span>
              <div className="text-base font-bold text-cyan-300 mt-0.5">{nh10Location.rainfall} mm</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">SOIL MOISTURE</span>
              <div className="text-base font-bold text-amber-300 mt-0.5">{nh10Location.soil_moisture}%</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">SLOPE GRADIENT</span>
              <div className="text-base font-bold text-emerald-300 mt-0.5">{nh10Location.slope}°</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">EXPOSED POPULATION</span>
              <div className="text-base font-bold text-white mt-0.5">{nh10Location.exposed_population.toLocaleString()}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">VILLAGES AT RISK</span>
              <div className="text-base font-bold text-white mt-0.5">{nh10Location.villages_count} Settlements</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">BRIDGES TRACKED</span>
              <div className="text-base font-bold text-cyan-400 mt-0.5">{nh10Location.bridges_count} Bridges</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">HEALTH & SCHOOLS</span>
              <div className="text-base font-bold text-indigo-300 mt-0.5">1 Hosp, {nh10Location.schools_count} Sch</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-300">
              <strong className="text-white">Primary Lifeline:</strong> {nh10Location.primary_lifeline} •{' '}
              <strong className="text-white">Substations:</strong> {nh10Location.substations_count} Units •{' '}
              <strong className="text-white">Current Road Status:</strong>{' '}
              <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                nh10Location.road_status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {nh10Location.road_status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('MAP', nh10Location.id)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
              >
                Inspect on GIS Map <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('RISK', nh10Location.id)}
                className="px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
              >
                Deep Risk Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ALL MONITORED NER LOCATIONS TABLE (Section 6 Additional Locations) */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              ALL MONITORED NER STRATEGIC CORRIDORS
            </h3>
            <p className="text-xs text-slate-400">
              Real-time multi-factor surveillance across Sikkim, Mizoram, Manipur, Meghalaya, and Assam
            </p>
          </div>
          <button
            onClick={() => onNavigate('MAP')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Open Tactical Map <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B13] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Corridor / Location</th>
                <th className="p-3">State</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Rainfall</th>
                <th className="p-3">Soil Moisture</th>
                <th className="p-3">Road Status</th>
                <th className="p-3">Exposed Pop</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {locations.map((loc) => {
                const pred = RiskService.getPredictionForLocation(loc);
                const isCritical = pred.risk_level === 'CRITICAL';
                const isHigh = pred.risk_level === 'HIGH';

                return (
                  <tr key={loc.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-semibold text-white font-sans">
                      <div>{loc.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {loc.id.substring(0, 8)}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-sans">{loc.state}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded font-bold ${
                        isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        isHigh ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {pred.risk_score} ({pred.risk_level})
                      </span>
                    </td>
                    <td className="p-3 text-cyan-300 font-bold">{loc.rainfall} mm</td>
                    <td className="p-3 text-amber-300 font-bold">{loc.soil_moisture}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        loc.road_status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        loc.road_status === 'RESTRICTED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {loc.road_status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{loc.exposed_population.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigate('RISK', loc.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-700 text-slate-200 hover:text-white transition-colors text-[11px]"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
