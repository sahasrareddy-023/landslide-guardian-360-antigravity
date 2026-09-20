// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 4: Impact Assessment & 14-Lifeline Framework
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// Highlights: 6 KEY BRIDGES TRACKED & 7 HEALTH HUBS TRACKED
// ==============================================================================

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Building, 
  HeartPulse, 
  Car, 
  Flame, 
  Zap, 
  Radio, 
  Droplet, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { InfrastructureService, ALL_14_LIFELINES } from '../services/infrastructureService';
import { LocationService } from '../services/locationService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';
import { LifelineCategory } from '../types';

interface Props {
  onNavigateToRisk?: (locationId: string) => void;
}

export const ImpactPage: React.FC<Props> = ({ onNavigateToRisk }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const infrastructure = InfrastructureService.getInfrastructure();
  const highlightMetrics = InfrastructureService.getHighlightMetrics();
  const breakdown = InfrastructureService.get14LifelineBreakdown();
  const locations = LocationService.getLocations();

  const filteredItems = selectedCategory === 'ALL'
    ? infrastructure
    : infrastructure.filter(i => i.infrastructure_type === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              IMPACT ASSESSMENT & 14-LIFELINE FRAMEWORK
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Vulnerability Assessment // Critical Public Infrastructure Mapping
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="DATABASE CONNECTED" />
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
        </div>
      </div>

      {/* Conceptual Clarity Banner: Risk vs Impact (Section 10 Requirement) */}
      <div className="bg-[#0C1322] border border-cyan-500/30 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-start gap-4">
        <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex-shrink-0 mt-0.5">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-mono font-bold text-cyan-300 uppercase tracking-wide">
            OPERATIONAL DISTINCTION: HAZARD RISK VS INFRASTRUCTURE IMPACT
          </span>
          <p className="text-slate-300 leading-relaxed">
            <strong>Risk</strong> evaluates: <em>"How likely and severe is the physical slope failure?"</em> (Rainfall, soil saturation, slope gradient).<br />
            <strong>Impact</strong> evaluates: <em>"What critical human lives and assets will be severed if failure occurs?"</em> (Exposed population, isolated hospitals, blocked lifelines, severed bridges).
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-0.5">
            * 14-Lifeline Framework is the application's operational disaster classification for NER assets.
          </div>
        </div>
      </div>

      {/* Highlights Cards (Section 11 Specific Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 6 Key Bridges Tracked */}
        <div className="bg-[#0C1322] border border-cyan-500/40 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold mb-2">
            <span>PROTOTYPE METRIC</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {highlightMetrics.bridgesCount} KEY BRIDGES TRACKED
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across Teesta, Tlawng, Noney, & Umshiang river corridors
          </p>
        </div>

        {/* Metric 2: 7 Health Hubs Tracked */}
        <div className="bg-[#0C1322] border border-emerald-500/40 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold mb-2">
            <span>PROTOTYPE METRIC</span>
            <HeartPulse className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {highlightMetrics.healthHubsCount} HEALTH HUBS TRACKED
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Emergency trauma hospitals and district health centers on standby
          </p>
        </div>

        {/* Metric 3: Total Lifelines Monitored */}
        <div className="bg-[#0C1322] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold mb-2">
            <span>FRAMEWORK COVERAGE</span>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            14 LIFELINE CATEGORIES
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {highlightMetrics.totalLifelines} Total tracked assets across North Eastern Region
          </p>
        </div>

        {/* Metric 4: Lifelines currently At-Risk */}
        <div className="bg-[#0C1322] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold mb-2">
            <span>VULNERABILITY STATUS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-amber-300">
            {highlightMetrics.atRiskLifelines} AT-RISK ASSETS
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Restricted highways, dam bridges, and mountain cut-slopes
          </p>
        </div>
      </div>

      {/* 14-Lifeline Categories Grid */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            14-LIFELINE OPERATIONAL MATRIX
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Select a category to filter inventory
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow'
                : 'bg-[#070B13] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="truncate">ALL ASSETS</div>
            <div className="text-base font-extrabold text-white mt-0.5">{infrastructure.length}</div>
          </button>

          {breakdown.map((item, idx) => (
            <button
              key={item.category}
              onClick={() => setSelectedCategory(item.category)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedCategory === item.category
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow'
                  : 'bg-[#070B13] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[10px] text-slate-500">#{idx + 1}</div>
              <div className="truncate font-semibold text-slate-200">{item.category}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                <strong className="text-white">{item.total}</strong> ({item.atRisk} at risk)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Lifeline Asset Inventory Table */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            CRITICAL ASSET INVENTORY ({filteredItems.length} ASSETS)
          </h3>
          <span className="text-xs font-mono text-cyan-400">
            Category: <strong>{selectedCategory}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B13] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Lifeline Asset Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Monitored Corridor</th>
                <th className="p-3">Operational Status</th>
                <th className="p-3">Vulnerability</th>
                <th className="p-3">Key Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-semibold text-white font-sans">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {item.id}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-sans">
                      {item.infrastructure_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-sans">{item.location_name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      item.status === 'AT RISK' || item.status === 'RESTRICTED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.vulnerability === 'CRITICAL' ? 'text-rose-400' :
                      item.vulnerability === 'HIGH' ? 'text-orange-400' :
                      item.vulnerability === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.vulnerability}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] font-sans">
                    {Object.entries(item.metadata || {}).map(([k, v]) => (
                      <span key={k} className="mr-2 inline-block">
                        <strong className="text-slate-300">{k.replace('_', ' ')}:</strong> {String(v)}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
