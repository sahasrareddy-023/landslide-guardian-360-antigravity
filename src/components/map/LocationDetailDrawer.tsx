// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Location Detail Drawer
// Displays full telemetry, 14-lifeline status, active alerts, and field reports
// Keyed strictly by: location_id -> locations.id
// ==============================================================================

import React from 'react';
import { 
  X, 
  MapPin, 
  CloudRain, 
  Droplets, 
  Mountain, 
  Users, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building,
  Radio,
  FileText
} from 'lucide-react';
import { LocationRecord, RiskPrediction, InfrastructureItem, AlertItem, FieldReport } from '../../types';
import { DataHonestyBadge } from '../common/DataHonestyBadge';
import { RiskService } from '../../services/riskService';
import { InfrastructureService } from '../../services/infrastructureService';
import { AlertService } from '../../services/alertService';
import { FieldReportService } from '../../services/fieldReportService';
import { PriorityService } from '../../services/priorityService';

interface Props {
  location: LocationRecord | null;
  onClose: () => void;
  onNavigateToModule: (module: 'RISK' | 'IMPACT' | 'PRIORITY' | 'ALERTS') => void;
}

export const LocationDetailDrawer: React.FC<Props> = ({
  location,
  onClose,
  onNavigateToModule
}) => {
  if (!location) return null;

  const riskPrediction = RiskService.getPredictionForLocation(location);
  const lifelines = InfrastructureService.getByLocation(location.id);
  const alerts = AlertService.getAlerts().filter(a => a.location_id === location.id);
  const fieldReports = FieldReportService.getFieldReports().filter(r => r.location_id === location.id);
  const priority = PriorityService.assessPriority(location);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-400 bg-rose-950/80 border-rose-800';
      case 'HIGH': return 'text-orange-400 bg-orange-950/80 border-orange-800';
      case 'MEDIUM': return 'text-amber-400 bg-amber-950/80 border-amber-800';
      default: return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0C1322] border-l border-slate-800 z-50 shadow-2xl flex flex-col animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-[#070B13] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              LOCATION PROFILE // ID: {location.id.substring(0, 8)}
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              {location.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Badges & Region */}
        <div className="flex flex-wrap items-center gap-2">
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
            {location.state} • {location.district}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </span>
        </div>

        {/* Risk & Priority Score Overview Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${getRiskColor(riskPrediction.risk_level)}`}>
            <div className="text-[10px] font-mono uppercase tracking-wider font-semibold opacity-80">
              Landslide Risk Score
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-mono font-extrabold">{riskPrediction.risk_score}</span>
              <span className="text-xs font-mono font-bold tracking-wider">/ 100</span>
            </div>
            <div className="text-xs font-bold mt-1 tracking-wider">
              {riskPrediction.risk_level} RISK
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-slate-900/90 border-slate-800 text-slate-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Emergency Priority
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-mono font-extrabold text-cyan-400">{priority.priority_score}</span>
              <span className="text-xs font-mono text-slate-400 font-bold tracking-wider">/ 100</span>
            </div>
            <div className="text-xs font-bold mt-1 tracking-wider text-cyan-300">
              {priority.priority_level} PRIORITY
            </div>
          </div>
        </div>

        {/* Environmental Telemetry Metrics */}
        <div className="bg-[#070B13] p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Environmental Telemetry</span>
            <span className="text-[10px] text-amber-400 font-normal">SIMULATED SENSORS</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
              <CloudRain className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
              <div className="text-base font-mono font-bold text-white">{location.rainfall} mm</div>
              <div className="text-[10px] font-mono text-slate-400">24h Rainfall</div>
            </div>

            <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
              <Droplets className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <div className="text-base font-mono font-bold text-white">{location.soil_moisture}%</div>
              <div className="text-[10px] font-mono text-slate-400">Soil Saturation</div>
            </div>

            <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
              <Mountain className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
              <div className="text-base font-mono font-bold text-white">{location.slope}°</div>
              <div className="text-[10px] font-mono text-slate-400">Slope Gradient</div>
            </div>
          </div>
        </div>

        {/* Road Connectivity Status */}
        <div className="bg-[#070B13] p-3 rounded-lg border border-slate-800 space-y-1.5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Road Connectivity & Lifeline Status
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">{location.road_name}</span>
            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
              location.road_status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              location.road_status === 'RESTRICTED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              STATUS: {location.road_status}
            </span>
          </div>
          {location.alternate_route && (
            <p className="text-[11px] text-slate-400 italic">
              Alternate: {location.alternate_route}
            </p>
          )}
        </div>

        {/* Human & Lifeline Exposure Summary */}
        <div className="bg-[#070B13] p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Human & 14-Lifeline Exposure</span>
            <button
              onClick={() => onNavigateToModule('IMPACT')}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              View Impact <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded">
              <Users className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-mono font-bold text-white">{location.exposed_population.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Exposed Citizens</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded">
              <Building className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="font-mono font-bold text-white">{location.villages_count} Settlements</div>
                <div className="text-[10px] text-slate-400">Vulnerable Villages</div>
              </div>
            </div>
          </div>

          {/* Lifelines summary */}
          <div className="text-xs space-y-1 pt-1">
            <div className="flex justify-between text-slate-300">
              <span>Bridges Monitored:</span>
              <strong className="font-mono text-white">{location.bridges_count}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Emergency Health Hubs:</span>
              <strong className="font-mono text-white">{location.hospitals_count}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Schools (Evacuation Shelters):</span>
              <strong className="font-mono text-white">{location.schools_count}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Power Grid Substations:</span>
              <strong className="font-mono text-white">{location.substations_count}</strong>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Alerts ({alerts.length})</span>
            <button
              onClick={() => onNavigateToModule('ALERTS')}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Manage Alerts <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
              No active alerts for this corridor
            </div>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="p-2.5 rounded-lg border border-slate-800 bg-[#070B13] text-xs space-y-1">
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    a.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-orange-950 text-orange-300'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="font-semibold text-white">{a.title}</div>
                <div className="text-[11px] text-slate-300">{a.message}</div>
              </div>
            ))
          )}
        </div>

        {/* Field Reports */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Geo-tagged Field Reports ({fieldReports.length})</span>
          </div>

          {fieldReports.length === 0 ? (
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
              No field reports logged in this zone
            </div>
          ) : (
            fieldReports.map((r) => (
              <div key={r.id} className="p-2.5 rounded-lg border border-slate-800 bg-[#070B13] text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-cyan-400 font-bold">{r.report_type}</span>
                  <span className="text-[10px] text-slate-400">{r.sync_status}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{r.description}</p>
                <div className="text-[10px] font-mono text-slate-500">By: {r.reporter_id}</div>
              </div>
            ))
          )}
        </div>

        {/* Action Recommendations */}
        <div className="bg-cyan-950/30 border border-cyan-800/50 p-3 rounded-lg space-y-1.5">
          <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Recommended Response Actions
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>Continuous corridor patrol at vulnerable cut-slopes</li>
            <li>Verify backup satellite transceiver connectivity</li>
            <li>Place SDRF/NDRF mountain rescue teams on standby</li>
          </ul>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-[#070B13] flex gap-2">
        <button
          onClick={() => onNavigateToModule('RISK')}
          className="flex-1 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors"
        >
          Risk Analysis
        </button>
        <button
          onClick={() => onNavigateToModule('PRIORITY')}
          className="flex-1 py-2 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-mono font-semibold transition-colors"
        >
          Priority Response
        </button>
      </div>
    </div>
  );
};
