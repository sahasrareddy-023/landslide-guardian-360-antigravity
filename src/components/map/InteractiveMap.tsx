// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Tactical GIS Interactive Map
// Leaflet-powered GIS dashboard for North Eastern Region (NER)
// ==============================================================================

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Eye, 
  Compass, 
  Radio, 
  Activity, 
  Filter,
  Maximize2
} from 'lucide-react';
import { LocationRecord, InfrastructureItem, FieldReport } from '../../types';
import { LocationService } from '../../services/locationService';
import { InfrastructureService } from '../../services/infrastructureService';
import { FieldReportService } from '../../services/fieldReportService';
import { LocationDetailDrawer } from './LocationDetailDrawer';
import { DataHonestyBadge } from '../common/DataHonestyBadge';
import { RiskService } from '../../services/riskService';

interface Props {
  selectedLocationId?: string;
  onSelectLocation?: (id: string) => void;
  onNavigateToModule?: (module: 'RISK' | 'IMPACT' | 'PRIORITY' | 'ALERTS') => void;
  height?: string;
}

export const InteractiveMap: React.FC<Props> = ({
  selectedLocationId,
  onSelectLocation,
  onNavigateToModule = () => {},
  height = 'calc(100vh - 170px)'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>([]);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationRecord | null>(null);

  // Layer toggles
  const [showHotspots, setShowHotspots] = useState(true);
  const [showLifelines, setShowLifelines] = useState(true);
  const [showFieldReports, setShowFieldReports] = useState(true);

  // Load data
  useEffect(() => {
    const locs = LocationService.getLocations();
    const infra = InfrastructureService.getInfrastructure();
    const reports = FieldReportService.getFieldReports();

    setLocations(locs);
    setInfrastructure(infra);
    setFieldReports(reports);

    if (selectedLocationId) {
      const found = locs.find(l => l.id === selectedLocationId);
      if (found) setActiveLocation(found);
    }
  }, [selectedLocationId]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on NER: Meghalaya / Assam / Sikkim triangle
    const map = L.map(mapContainerRef.current, {
      center: [25.5788, 92.5],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
    });

    // Dark Tactical Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | MDoNER NER GIS',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when layers or data change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Hotspots / Monitored Locations
    if (showHotspots) {
      locations.forEach(loc => {
        const pred = RiskService.getPredictionForLocation(loc);
        const isCritical = pred.risk_level === 'CRITICAL';
        const isHigh = pred.risk_level === 'HIGH';

        const ringColor = isCritical ? '#EF4444' : isHigh ? '#F97316' : '#F59E0B';
        const pulseAnim = isCritical ? 'animation: pulseGlow 1.5s infinite;' : '';

        const customHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${ringColor}22; border: 2px solid ${ringColor}; ${pulseAnim}"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: ${ringColor}; display: flex; align-items: center; justify-content: center; color: white; font-family: monospace; font-size: 10px; font-weight: 800; box-shadow: 0 0 10px ${ringColor};">
              ${pred.risk_score}
            </div>
            <div style="position: absolute; top: 24px; white-space: nowrap; font-family: monospace; font-size: 11px; font-weight: 700; color: #E2E8F0; background: rgba(7, 11, 19, 0.9); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); pointer-events: none;">
              ${loc.name}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'custom-location-marker',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([loc.latitude, loc.longitude], { icon });
        marker.on('click', () => {
          setActiveLocation(loc);
          if (onSelectLocation) onSelectLocation(loc.id);
          mapInstanceRef.current?.flyTo([loc.latitude, loc.longitude], 10, { duration: 1.2 });
        });

        marker.addTo(layer);
      });
    }

    // 2. 14-Lifelines (Bridges, Health Hubs, Schools)
    if (showLifelines) {
      infrastructure.forEach(item => {
        if (!item.latitude || !item.longitude) return;

        let iconColor = '#3B82F6';
        let label = 'LF';

        if (item.infrastructure_type === 'Bridges') {
          iconColor = item.status === 'AT RISK' ? '#F97316' : '#06B6D4';
          label = 'BR';
        } else if (item.infrastructure_type === 'Hospitals') {
          iconColor = '#10B981';
          label = 'HH';
        } else if (item.infrastructure_type === 'Schools') {
          iconColor = '#8B5CF6';
          label = 'SC';
        }

        const customHtml = `
          <div style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; background: #0F172A; border: 1px solid ${iconColor}; color: ${iconColor}; font-family: monospace; font-size: 9px; font-weight: 700; cursor: pointer;" title="${item.name} (${item.infrastructure_type})">
            ${label}
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'custom-lifeline-marker',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        const marker = L.marker([item.latitude, item.longitude], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: #1E293B;">
            <strong style="color: #0F172A;">${item.name}</strong><br/>
            <span style="font-size: 11px; color: #64748B;">Type: ${item.infrastructure_type} | Status: <strong>${item.status}</strong></span>
          </div>
        `);
        marker.addTo(layer);
      });
    }

    // 3. Field Reports
    if (showFieldReports) {
      fieldReports.forEach(report => {
        const customHtml = `
          <div style="display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: #EF4444; border: 2px solid white; cursor: pointer;" title="Field Report: ${report.report_type}">
            <span style="width: 4px; height: 4px; background: white; border-radius: 50%;"></span>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'custom-field-report-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([report.latitude, report.longitude], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: #1E293B;">
            <strong style="color: #EF4444;">FIELD REPORT: ${report.report_type}</strong><br/>
            <p style="margin: 4px 0; font-size: 11px;">${report.description}</p>
            <span style="font-size: 10px; color: #64748B;">Reporter: ${report.reporter_id} | Status: ${report.sync_status}</span>
          </div>
        `);
        marker.addTo(layer);
      });
    }
  }, [locations, infrastructure, fieldReports, showHotspots, showLifelines, showFieldReports, onSelectLocation]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-[#070B13]" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Tactical Overlays */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-[#0C1322]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2 flex items-center gap-2 shadow-lg">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            GIS LAYERS
          </span>
          <span className="text-slate-600">|</span>

          {/* Hotspots Toggle */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              showHotspots
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            Hotspots ({locations.length})
          </button>

          {/* Lifelines Toggle */}
          <button
            onClick={() => setShowLifelines(!showLifelines)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              showLifelines
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            14-Lifelines ({infrastructure.length})
          </button>

          {/* Field Reports Toggle */}
          <button
            onClick={() => setShowFieldReports(!showFieldReports)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              showFieldReports
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            Field Reports ({fieldReports.length})
          </button>
        </div>

        <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
      </div>

      {/* Quick Location Fly-to Dropdown */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-[#0C1322]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-xl flex items-center gap-2 text-xs font-mono">
        <Compass className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-400">JUMP TO:</span>
        <select
          value={activeLocation?.id || ''}
          onChange={(e) => {
            const loc = locations.find(l => l.id === e.target.value);
            if (loc) {
              setActiveLocation(loc);
              mapInstanceRef.current?.flyTo([loc.latitude, loc.longitude], 11, { duration: 1.2 });
            }
          }}
          className="bg-slate-900 text-cyan-300 font-semibold border border-slate-700 rounded px-2 py-1 focus:outline-none cursor-pointer"
        >
          <option value="">Select Monitored Corridor...</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.state})
            </option>
          ))}
        </select>
      </div>

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto bg-[#0C1322]/90 backdrop-blur-md border border-slate-800 rounded-lg p-3 shadow-xl text-[11px] font-mono space-y-1.5 hidden md:block">
        <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">
          TACTICAL LEGEND
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Critical Risk (&gt;90)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-slate-300">High Risk (70-89)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-slate-300">Medium Risk (45-69)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <span className="w-3 h-3 rounded bg-cyan-600 text-white flex items-center justify-center text-[9px] font-bold">BR</span>
          <span className="text-slate-300">Bridges Tracked (6 Total)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">HH</span>
          <span className="text-slate-300">Health Hubs (7 Total)</span>
        </div>
      </div>

      {/* Location Detail Drawer */}
      <LocationDetailDrawer
        location={activeLocation}
        onClose={() => setActiveLocation(null)}
        onNavigateToModule={onNavigateToModule}
      />
    </div>
  );
};
