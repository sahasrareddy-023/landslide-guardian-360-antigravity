// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Standardized Data Honesty Badge (Light Theme)
// Enforces SIH26001 Data-Honesty Rule across all screens
// ==============================================================================

import React from 'react';
import { AlertCircle, CheckCircle2, Cpu, Database, Radio, Sparkles } from 'lucide-react';

export type HonestyType = 
  | 'SIMULATED DEMONSTRATION DATA'
  | 'DATABASE CONNECTED'
  | 'FIELD REPORT'
  | 'MODEL-GENERATED'
  | 'EXTERNAL DATA — WHEN ACTUALLY CONNECTED'
  | 'FUTURE INTEGRATION'
  | 'AI/ML MODEL: DEMONSTRATION ENGINE';

interface Props {
  type: HonestyType;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataHonestyBadge: React.FC<Props> = ({ type, className = '', size = 'sm' }) => {
  let bg = 'bg-slate-100 text-slate-700 border-slate-300';
  let icon = <AlertCircle className="w-3 h-3" />;

  switch (type) {
    case 'SIMULATED DEMONSTRATION DATA':
      bg = 'bg-amber-50 text-amber-800 border-amber-300';
      icon = <Radio className="w-3 h-3 text-amber-600" />;
      break;
    case 'DATABASE CONNECTED':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      icon = <Database className="w-3 h-3 text-emerald-600" />;
      break;
    case 'FIELD REPORT':
      bg = 'bg-cyan-50 text-cyan-800 border-cyan-300';
      icon = <CheckCircle2 className="w-3 h-3 text-cyan-600" />;
      break;
    case 'MODEL-GENERATED':
      bg = 'bg-indigo-50 text-indigo-800 border-indigo-300';
      icon = <Sparkles className="w-3 h-3 text-indigo-600" />;
      break;
    case 'AI/ML MODEL: DEMONSTRATION ENGINE':
      bg = 'bg-purple-50 text-purple-800 border-purple-300';
      icon = <Cpu className="w-3 h-3 text-purple-600" />;
      break;
    case 'FUTURE INTEGRATION':
    case 'EXTERNAL DATA — WHEN ACTUALLY CONNECTED':
      bg = 'bg-slate-50 text-slate-600 border-slate-300 border-dashed';
      icon = <Radio className="w-3 h-3 text-slate-500" />;
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded border ${bg} ${padding} ${className}`}
      title={type}
    >
      {icon}
      <span>{type}</span>
    </span>
  );
};
