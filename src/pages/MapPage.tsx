// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 2: GIS Tactical Map Page
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// ==============================================================================

import React from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';
import { Map as MapIcon } from 'lucide-react';

interface Props {
  selectedLocationId?: string;
  onSelectLocation?: (id: string) => void;
  onNavigateToModule?: (module: 'RISK' | 'IMPACT' | 'PRIORITY' | 'ALERTS') => void;
}

export const MapPage: React.FC<Props> = ({
  selectedLocationId,
  onSelectLocation,
  onNavigateToModule
}) => {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              TACTICAL GIS MAP & LIFELINE SURVEILLANCE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Geographic Information System Coverage // North Eastern Region (NER)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" size="sm" />
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            BOUNDS: 22.0°N - 28.5°N | 88.0°E - 97.5°E
          </span>
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap
        selectedLocationId={selectedLocationId}
        onSelectLocation={onSelectLocation}
        onNavigateToModule={onNavigateToModule}
        height="calc(100vh - 210px)"
      />
    </div>
  );
};
