// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 8: Analytics & Forecasting Dashboard
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// Strict Data-Honesty Rule: Displays INSUFFICIENT DATA instead of inventing metrics
// ==============================================================================

import React, { useState } from 'react';
import { 
  LineChart, 
  CloudRain, 
  Droplets, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  BarChart2,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';
import { LocationService } from '../services/locationService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

export const AnalyticsPage: React.FC = () => {
  const locations = LocationService.getLocations();
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    locations[0]?.id || ''
  );

  const selectedLoc = locations.find(l => l.id === selectedLocationId) || locations[0];
  const trend24h = AnalyticsService.get24HourTrend(selectedLoc?.id || '');
  const correlations = AnalyticsService.getRainfallMoistureCorrelations();
  const alertDist = AnalyticsService.getAlertSeverityDistribution();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              DISASTER ANALYTICS & TREND FORECASTING
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Empirical Precipitation, Pore Saturation & Threshold Correlation Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
          <DataHonestyBadge type="DATABASE CONNECTED" />
        </div>
      </div>

      {/* Location Selector */}
      <div className="flex items-center justify-between bg-[#0C1322] border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 uppercase font-bold">ANALYSIS TARGET:</span>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-cyan-300 font-semibold rounded px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.state})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          SURVEILLANCE WINDOW: 24-HOUR ROLLING
        </div>
      </div>

      {/* 24-Hour Trend Section (With Strict Data Honesty Guardrail) */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              24-HOUR TELEMETRY PROGRESSION // {selectedLoc?.name}
            </h3>
            <p className="text-xs text-slate-400">
              Rainfall intensity vs. soil saturation trend leading to current hazard level
            </p>
          </div>
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
        </div>

        {trend24h.hasData ? (
          <div className="space-y-4">
            {/* Custom Tactical SVG Chart */}
            <div className="relative h-64 w-full bg-[#070B13] rounded-lg border border-slate-800 p-4 flex flex-col justify-between">
              {/* Top Legend */}
              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-0.5 bg-cyan-400"></span> Rainfall (mm/24h)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-0.5 bg-amber-400"></span> Soil Saturation (%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-3 h-0.5 bg-rose-400"></span> Risk Score (0-100)
                </span>
              </div>

              {/* Data Bars / Columns Visualizer */}
              <div className="grid grid-cols-6 gap-2 h-44 items-end pt-4 border-b border-slate-800 pb-2">
                {trend24h.data.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1 w-full justify-center h-36">
                      {/* Rain bar */}
                      <div 
                        className="w-3 sm:w-5 bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all"
                        style={{ height: `${Math.min((d.rainfall / 260) * 100, 100)}%` }}
                        title={`Rainfall: ${d.rainfall} mm`}
                      />
                      {/* Moisture bar */}
                      <div 
                        className="w-3 sm:w-5 bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all"
                        style={{ height: `${d.soil_moisture}%` }}
                        title={`Moisture: ${d.soil_moisture}%`}
                      />
                      {/* Risk point bar */}
                      <div 
                        className="w-3 sm:w-5 bg-rose-500/80 hover:bg-rose-400 rounded-t transition-all"
                        style={{ height: `${d.risk_score}%` }}
                        title={`Risk Score: ${d.risk_score}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">{d.hour}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Start: -20 hours</span>
                <span>Current Real-time Telemetry State</span>
              </div>
            </div>

            {/* Metric Summary Strip */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#070B13] rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px]">PEAK 24H RAINFALL</span>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{selectedLoc?.rainfall} mm</div>
              </div>
              <div className="p-3 bg-[#070B13] rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px]">MAX PORE SATURATION</span>
                <div className="text-lg font-bold text-amber-400 mt-0.5">{selectedLoc?.soil_moisture}%</div>
              </div>
              <div className="p-3 bg-[#070B13] rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px]">CURRENT RISK SCORE</span>
                <div className="text-lg font-bold text-rose-400 mt-0.5">{selectedLoc ? AnalyticsService.getRainfallMoistureCorrelations().find(c => c.locationId === selectedLoc.id)?.risk_score : '--'}</div>
              </div>
            </div>
          </div>
        ) : (
          /* STRICT SECTION 24 RULE: DISPLAY "INSUFFICIENT DATA" BANNER */
          <div className="p-12 text-center bg-[#070B13] rounded-lg border border-slate-800 space-y-3">
            <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold font-mono text-slate-200 tracking-wider">
              INSUFFICIENT DATA
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Historical 24-hour time-series telemetry is not available for <strong>{selectedLoc?.name}</strong>. 
              In adherence to the SIH26001 Data-Honesty Rule, false trendlines are not fabricated. 
              Only real-time baseline readings are currently logged.
            </p>
            <div className="text-[11px] font-mono text-cyan-400">
              * Switch to NH-10 Teesta Valley Corridor to inspect active simulated demonstration telemetry.
            </div>
          </div>
        )}
      </div>

      {/* Regional Correlations & Alert Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall vs Soil Moisture Regional Comparison */}
        <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            REGIONAL ENVIRONMENTAL MATRIX
          </h3>

          <div className="space-y-3 text-xs font-mono">
            {correlations.map((item) => (
              <div key={item.locationId} className="p-3 bg-[#070B13] rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-white">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    item.risk_score >= 90 ? 'bg-rose-950 text-rose-300' :
                    item.risk_score >= 70 ? 'bg-orange-950 text-orange-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    Risk {item.risk_score}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Rainfall:</span>{' '}
                    <strong className="text-cyan-300">{item.rainfall} mm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Moisture:</span>{' '}
                    <strong className="text-amber-300">{item.soil_moisture}%</strong>
                  </div>
                </div>

                {/* Relative moisture bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.soil_moisture > 90 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${item.soil_moisture}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Severity Distribution */}
        <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            ALERT FREQUENCY BY SEVERITY
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
            <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800/80">
              <div className="text-3xl font-extrabold text-rose-400">{alertDist.CRITICAL || 0}</div>
              <div className="text-rose-300 font-bold mt-1">CRITICAL ALERTS</div>
            </div>

            <div className="p-4 rounded-lg bg-orange-950/40 border border-orange-800/80">
              <div className="text-3xl font-extrabold text-orange-400">{alertDist.HIGH || 0}</div>
              <div className="text-orange-300 font-bold mt-1">HIGH ALERTS</div>
            </div>

            <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-800/80">
              <div className="text-3xl font-extrabold text-amber-400">{alertDist.MEDIUM || 0}</div>
              <div className="text-amber-300 font-bold mt-1">MEDIUM ALERTS</div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/80">
              <div className="text-3xl font-extrabold text-emerald-400">{alertDist.LOW || 0}</div>
              <div className="text-emerald-300 font-bold mt-1">LOW ALERTS</div>
            </div>
          </div>

          <div className="p-3 bg-[#070B13] rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
            <strong>Observation:</strong> The majority of active alerts originate from the Teesta Valley (NH-10) and Lunglei ridge corridors during heavy convective monsoon precipitation.
          </div>
        </div>
      </div>
    </div>
  );
};
