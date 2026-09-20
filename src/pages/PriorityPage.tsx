// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 5: Emergency Response Prioritisation Engine
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// ==============================================================================

import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Users, 
  Building, 
  Truck, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Navigation
} from 'lucide-react';
import { PriorityService } from '../services/priorityService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';
import { PriorityAssessment, PriorityLevel } from '../types';

export const PriorityPage: React.FC = () => {
  const [priorities] = useState<PriorityAssessment[]>(PriorityService.getAllPriorities());
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    priorities[0]?.location_id || ''
  );
  const [dispatchConfirmed, setDispatchConfirmed] = useState<Record<string, boolean>>({});

  const selectedPriority = priorities.find(p => p.location_id === selectedLocationId) || priorities[0];

  const getPriorityBadge = (level: PriorityLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH': return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border-amber-800';
      default: return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  const handleDispatch = (locationId: string) => {
    setDispatchConfirmed(prev => ({ ...prev, [locationId]: true }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              EMERGENCY RESPONSE PRIORITISATION ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Multi-Factor Triage Formulation // SDRF / NDRF Operational Dispatch Priority
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="MODEL-GENERATED" />
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
        </div>
      </div>

      {/* Priority Engine Explanation Banner (Section 16 Jury Transparency) */}
      <div className="bg-[#0C1322] border border-cyan-500/30 p-4 rounded-xl shadow-lg flex items-start gap-4">
        <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex-shrink-0 mt-0.5">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-mono font-bold text-cyan-300 uppercase tracking-wide">
            JURY TRANSPARENCY: HOW PRIORITY IS COMPUTED
          </span>
          <p className="text-slate-300 leading-relaxed">
            Priority balances <strong>Hazard Severity (40%)</strong> with <strong>Road Transit Disruption (25%)</strong>, 
            <strong>Populous Community Exposure (20%)</strong>, and <strong>Critical Health Hub / Bridge Compromise (15%)</strong>.
            This ensures rescue forces (NDRF / SDRF) and heavy earthmovers are deployed where lives and strategic lifelines face catastrophic severance first.
          </p>
        </div>
      </div>

      {/* Selected Corridor Priority Deep Dive */}
      {selectedPriority && (
        <div className="bg-[#0C1322] border border-rose-500/40 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                TRIAGE ASSESSMENT FOR CORRIDOR:
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {selectedPriority.location_name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-[#070B13] border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Emergency Priority Score</div>
                <div className="text-3xl font-mono font-extrabold text-rose-400">
                  {selectedPriority.priority_score} <span className="text-xs text-rose-300">/ 100</span>
                </div>
              </div>

              <span className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border ${getPriorityBadge(selectedPriority.priority_level)}`}>
                {selectedPriority.priority_level} PRIORITY
              </span>
            </div>
          </div>

          {/* Transparent Jury Explanation (Section 16) */}
          <div className="p-4 rounded-lg bg-[#070B13] border border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              OPERATIONAL EXPLANATION (JURY GROUNDING):
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
              "{selectedPriority.explanation}"
            </p>
          </div>

          {/* Contributing Multi-Factor Matrix Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px]">HAZARD SEVERITY</span>
              <div className="text-lg font-bold text-rose-400 mt-1">Risk {selectedPriority.risk_score} / 100</div>
              <div className="text-[10px] text-slate-500">Weight: 40%</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px]">ROAD CONNECTIVITY</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{selectedPriority.road_status}</div>
              <div className="text-[10px] text-slate-500">Weight: 25%</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px]">EXPOSED POPULATION</span>
              <div className="text-lg font-bold text-cyan-300 mt-1">{selectedPriority.exposed_population.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Weight: 20%</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px]">LIFELINES VULNERABLE</span>
              <div className="text-lg font-bold text-indigo-300 mt-1">{selectedPriority.critical_lifelines_count} Assets</div>
              <div className="text-[10px] text-slate-500">Weight: 15%</div>
            </div>
          </div>

          {/* Action Dispatch Directives */}
          <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" />
                RECOMMENDED OPERATIONAL DISPATCH ACTIONS
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Authorized for State Disaster Management Authority (SDMA)
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedPriority.recommended_dispatch.map((dispatch, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#070B13] p-2 rounded border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{dispatch}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDispatch(selectedPriority.location_id)}
                disabled={dispatchConfirmed[selectedPriority.location_id]}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  dispatchConfirmed[selectedPriority.location_id]
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white shadow-lg'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {dispatchConfirmed[selectedPriority.location_id]
                    ? 'DISPATCH ORDER TRANSMITTED (SIMULATED)'
                    : 'DISPATCH EMERGENCY RESPONSE FORCES'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Priority Ranking Across All NER Corridors */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
          STRATEGIC EMERGENCY PRIORITY RANKINGS (ALL NER ZONES)
        </h3>

        <div className="space-y-2">
          {priorities.map((item, rank) => {
            const isSelected = item.location_id === selectedLocationId;

            return (
              <div
                key={item.location_id}
                onClick={() => setSelectedLocationId(item.location_id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : 'bg-[#070B13] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                    #{rank + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {item.location_name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      Pop: {item.exposed_population.toLocaleString()} • Road: {item.road_status} • Risk: {item.risk_score}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400">PRIORITY</span>
                    <div className="text-lg font-extrabold text-white">
                      {item.priority_score} <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getPriorityBadge(item.priority_level)}`}>
                    {item.priority_level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
