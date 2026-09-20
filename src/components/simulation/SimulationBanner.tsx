// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Simulation Control & Scenario Visualizer
// Strict adherence to Section 7: "RUN SIMULATED DEMO SCENARIO"
// ==============================================================================

import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Radio, 
  Activity,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { SimulationService, SimulationStep, SIMULATION_STAGES } from '../../services/simulationService';
import { DataHonestyBadge } from '../common/DataHonestyBadge';

interface Props {
  onSimulationComplete: () => void;
  onSimulationReset: () => void;
  isSimulatingActive: boolean;
}

export const SimulationBanner: React.FC<Props> = ({
  onSimulationComplete,
  onSimulationReset,
  isSimulatingActive
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);

  const handleRunSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);

    await SimulationService.runSimulatedScenario((step) => {
      setCurrentStep(step);
    });

    setIsRunning(false);
    onSimulationComplete();
  };

  const handleReset = () => {
    SimulationService.resetSimulation();
    setCurrentStep(null);
    setIsRunning(false);
    onSimulationReset();
  };

  return (
    <div className="bg-[#0C1322] border border-cyan-500/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Scenario Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-mono text-[11px] font-bold border border-cyan-800/60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              DEMO SCENARIO ENGINE
            </span>
            <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
            <span className="text-xs font-mono text-slate-400">
              Corridor: <strong className="text-slate-200">NH-10 Teesta Valley (KM 28–35)</strong>
            </span>
          </div>

          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Multi-Stage Environmental Deterioration & Emergency Escalation
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Simulates real-world monsoon cloudburst leading to soil saturation, slope failure on NH-10, 
            automatic early warning generation, and emergency response prioritization escalation (Risk 88 → 96, Priority 99).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleRunSimulation}
            disabled={isRunning || isSimulatingActive}
            className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
              isSimulatingActive
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : isRunning
                ? 'bg-cyan-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/40 hover:scale-[1.02]'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunning ? 'ESCALATING SCENARIO...' : 'RUN SIMULATED DEMO SCENARIO'}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3.5 py-2.5 rounded-lg font-mono text-xs font-semibold tracking-wider text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:text-white transition-all flex items-center gap-1.5"
            title="Reset scenario to baseline values"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>RESET DEMO SCENARIO</span>
          </button>
        </div>
      </div>

      {/* Real-time Stage Progression Cards */}
      {(isRunning || isSimulatingActive || currentStep) && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {SIMULATION_STAGES.map((s) => {
              const isPast = currentStep ? currentStep.stage > s.stage : isSimulatingActive;
              const isCurrent = currentStep ? currentStep.stage === s.stage : false;

              return (
                <div
                  key={s.stage}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50 scale-[1.02]'
                      : isPast
                      ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold mb-1">
                    <span className="flex items-center gap-1">
                      {isCurrent ? (
                        <Activity className="w-3 h-3 text-rose-400 animate-pulse" />
                      ) : isPast ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-slate-600 inline-block text-center text-[9px] leading-3">
                          {s.stage}
                        </span>
                      )}
                      Stage {s.stage}
                    </span>
                    <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                      s.stage >= 3 ? 'bg-rose-900/60 text-rose-300' : 'bg-amber-900/60 text-amber-300'
                    }`}>
                      R: {s.risk_score} | P: {s.priority_score}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate mb-1">
                    {s.title.split('—')[1] || s.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    Rain: <strong className="text-cyan-300">{s.rainfall}mm</strong> | Soil: <strong className="text-amber-300">{s.soil_moisture}%</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Stage Detailed Message */}
          {currentStep && (
            <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg flex items-start gap-3 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs">
                <span className="font-mono font-bold text-rose-300 uppercase tracking-wide">
                  {currentStep.title}
                </span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  {currentStep.description}
                </p>
                {currentStep.alert_generated && (
                  <div className="mt-1.5 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>EMERGENCY ALERT GENERATED & DISPATCH NOTIFIED: Kalimpong SDRF & NDRF Battalions</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
