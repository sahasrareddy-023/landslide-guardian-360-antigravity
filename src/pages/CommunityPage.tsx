// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 6: Community & Field Reporting
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// Low-Network / Offline-First Queuing & Multi-Party Citizen Surveillance
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Camera, 
  Upload, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Send,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { FieldReport, FieldReportCategory, RiskLevel, RoadStatus, LocationRecord } from '../types';
import { FieldReportService } from '../services/fieldReportService';
import { LocationService } from '../services/locationService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

export const CommunityPage: React.FC = () => {
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Form State
  const [reportType, setReportType] = useState<FieldReportCategory>('SLOPE CRACK');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(27.0512);
  const [longitude, setLongitude] = useState(88.4705);
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [roadCondition, setRoadCondition] = useState<RoadStatus>('RESTRICTED');
  const [reporterId, setReporterId] = useState('CITIZEN_OBSERVER_01');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const refreshData = () => {
    setReports(FieldReportService.getFieldReports());
    const locs = LocationService.getLocations();
    setLocations(locs);
    if (!selectedLocationId && locs.length > 0) {
      setSelectedLocationId(locs[0].id);
      setLatitude(locs[0].latitude);
      setLongitude(locs[0].longitude);
    }
    setIsOffline(FieldReportService.isOfflineSimulated());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLocationChange = (locId: string) => {
    setSelectedLocationId(locId);
    const loc = locations.find(l => l.id === locId);
    if (loc) {
      setLatitude(loc.latitude + (Math.random() * 0.01 - 0.005));
      setLongitude(loc.longitude + (Math.random() * 0.01 - 0.005));
    }
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    FieldReportService.toggleOfflineSimulation(next);
    setIsOffline(next);
  };

  const handleManualSync = () => {
    const { syncedCount } = FieldReportService.triggerManualSync();
    setSyncNotice(`Synchronized ${syncedCount} queued reports successfully with NER Central Command.`);
    refreshData();
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const loc = locations.find(l => l.id === selectedLocationId);

    FieldReportService.submitReport({
      location_id: selectedLocationId,
      location_name: loc?.name || 'NER Remote Sector',
      reporter_id: reporterId,
      report_type: reportType,
      description,
      latitude,
      longitude,
      severity,
      road_condition: roadCondition,
      media_url: photoPreview || undefined
    });

    setDescription('');
    setPhotoPreview(null);
    setSubmitSuccess(true);
    refreshData();

    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const pendingCount = reports.filter(r => r.sync_status === 'PENDING SYNC' || r.sync_status === 'RETRY').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              COMMUNITY & FIELD REPORTING PORTAL
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Geo-Tagged Incident Ground-Truthing // Low-Network Offline Resilient Queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="FIELD REPORT" />
          <DataHonestyBadge type="DATABASE CONNECTED" />
        </div>
      </div>

      {/* Offline Sync Controls Strip (Section 22 Requirements) */}
      <div className="bg-[#0C1322] border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${
            isOffline ? 'bg-rose-950/70 border-rose-700 text-rose-400' : 'bg-emerald-950/70 border-emerald-700 text-emerald-400'
          }`}>
            {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase">
                {isOffline ? 'SIMULATED OFFLINE MODE (LOW-NETWORK)' : 'NETWORK CONNECTED (CENTRAL SYNC ACTIVE)'}
              </span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold animate-pulse">
                  {pendingCount} PENDING SYNC
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isOffline
                ? 'Reports are persisted locally in browser IndexedDB/LocalStorage with cryptographic timestamps until uplink is restored.'
                : 'Central database uplink active. Field submissions propagate to the GIS Map instantaneously.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleToggleOffline}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
              isOffline
                ? 'bg-rose-900/60 border-rose-700 text-rose-200 hover:bg-rose-800'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isOffline ? 'Restore Network' : 'Simulate Offline Mode'}
          </button>

          {pendingCount > 0 && (
            <button
              onClick={handleManualSync}
              className="px-3.5 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Submitted Reports on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Field Submission Form */}
        <div className="lg:col-span-5 bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              SUBMIT GEO-TAGGED OBSERVATION
            </h3>
            <span className="text-[10px] font-mono text-slate-500">CITIZEN / RANGER</span>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-cyan-950/60 border border-cyan-800 rounded-lg text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report saved {isOffline ? 'locally (PENDING SYNC)' : 'and logged to GIS map'}!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Report Type */}
            <div>
              <label className="text-slate-300 block mb-1 font-bold">REPORT CATEGORY:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as FieldReportCategory)}
                className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2.5 text-cyan-300 focus:outline-none focus:border-cyan-500 font-semibold"
              >
                <option value="SLOPE CRACK">SLOPE CRACK (Tension Fissure)</option>
                <option value="SLOPE MOVEMENT">SLOPE MOVEMENT (Active Soil Creep)</option>
                <option value="LANDSLIDE">LANDSLIDE (Active Debris Slide)</option>
                <option value="ROAD BLOCKAGE">ROAD BLOCKAGE (Rockfall / Boulder)</option>
                <option value="INFRASTRUCTURE DAMAGE">INFRASTRUCTURE DAMAGE (Bridge / Wall)</option>
                <option value="OTHER">OTHER HAZARD</option>
              </select>
            </div>

            {/* Target Location / Corridor */}
            <div>
              <label className="text-slate-300 block mb-1 font-bold">MONITORED CORRIDOR / SECTOR:</label>
              <select
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">LATITUDE (°N):</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">LONGITUDE (°E):</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                  required
                />
              </div>
            </div>

            {/* Severity & Road Condition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">OBSERVED SEVERITY:</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                  className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">ROAD TRANSIT STATUS:</label>
                <select
                  value={roadCondition}
                  onChange={(e) => setRoadCondition(e.target.value as RoadStatus)}
                  className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="OPEN">OPEN (Normal)</option>
                  <option value="RESTRICTED">RESTRICTED (One-way / Slow)</option>
                  <option value="BLOCKED">BLOCKED (Total Obstruction)</option>
                  <option value="CRITICAL">CRITICAL (Pier Damage)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 block mb-1 font-bold">DETAILED GROUND DESCRIPTION:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe crack length, depth, water seepage, or fallen debris on roadway..."
                className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                required
              />
            </div>

            {/* Photo / Media Preview */}
            <div>
              <label className="text-slate-300 block mb-1 font-bold">MEDIA ATTACHMENT (PHOTO):</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-lg cursor-pointer text-slate-300 text-xs">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Choose Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoPreview && (
                  <span className="text-[11px] text-emerald-400 font-bold">Photo loaded</span>
                )}
              </div>
              {photoPreview && (
                <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-700 w-32 h-24">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Reporter ID */}
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">REPORTER IDENTIFIER / CALLSIGN:</label>
              <input
                type="text"
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                className="w-full bg-[#070B13] border border-slate-700 rounded-lg p-2 text-slate-300 text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT FIELD REPORT</span>
            </button>
          </form>
        </div>

        {/* Right: Submitted Reports Stream */}
        <div className="lg:col-span-7 bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                GEO-TAGGED FIELD REPORTS REGISTER ({reports.length})
              </h3>
              <p className="text-xs text-slate-400">
                Sorted by most recent field observation
              </p>
            </div>
            <DataHonestyBadge type="FIELD REPORT" size="sm" />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
            {reports.map((r) => {
              const isPending = r.sync_status === 'PENDING SYNC' || r.sync_status === 'RETRY';

              return (
                <div
                  key={r.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isPending
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : 'bg-[#070B13] border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        {r.report_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        r.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        r.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {r.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPending
                          ? 'bg-amber-900/60 text-amber-300 border border-amber-700 animate-pulse'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {r.sync_status}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(r.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-200 text-xs font-sans mt-2 leading-relaxed">
                    {r.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{r.location_name || 'GPS'}: {r.latitude.toFixed(4)}°N, {r.longitude.toFixed(4)}°E</span>
                    </div>
                    <div>
                      Road: <strong className="text-slate-300">{r.road_condition}</strong> • Reporter: <strong className="text-slate-300">{r.reporter_id}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
