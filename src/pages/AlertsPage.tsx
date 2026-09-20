// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 7: Early Warning & Alert Lifecycle Management
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// Full State Transition: NEW -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED -> CLOSED
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building, 
  Car, 
  Check, 
  ArrowRight,
  Send,
  History,
  Info
} from 'lucide-react';
import { AlertItem, AlertStatus, RiskLevel } from '../types';
import { AlertService } from '../services/alertService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const refreshData = () => {
    const list = AlertService.getAlerts();
    setAlerts(list);
    if (!selectedAlertId && list.length > 0) {
      setSelectedAlertId(list[0].id);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusTransition = (id: string, newStatus: AlertStatus) => {
    AlertService.updateAlertStatus(id, newStatus, 'DUTY_OPERATOR_NER');
    refreshData();
  };

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityColor = (sev: RiskLevel) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH': return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'MEDIUM': return 'bg-amber-950 text-amber-300 border-amber-800';
      default: return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  const getStatusColor = (st: AlertStatus) => {
    switch (st) {
      case 'NEW': return 'bg-rose-900/80 text-rose-200 border-rose-600 animate-pulse';
      case 'ACKNOWLEDGED': return 'bg-amber-900/80 text-amber-200 border-amber-600';
      case 'IN_PROGRESS': return 'bg-blue-900/80 text-blue-200 border-blue-600';
      case 'RESOLVED': return 'bg-emerald-900/80 text-emerald-200 border-emerald-600';
      case 'CLOSED': return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              EARLY WARNING & ALERT LIFECYCLE CENTER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              End-to-End Operational Lifecycle: NEW &rarr; ACKNOWLEDGED &rarr; IN_PROGRESS &rarr; RESOLVED &rarr; CLOSED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="DATABASE CONNECTED" />
          <DataHonestyBadge type="SIMULATED DEMONSTRATION DATA" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0C1322] border border-slate-800 p-3 rounded-xl text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">STATUS:</span>
          {['ALL', 'NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">SEVERITY:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Alert Feed, Right Alert Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alert List */}
        <div className="lg:col-span-5 bg-[#0C1322] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              ACTIVE ALERTS REGISTER ({filteredAlerts.length})
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">SELECT TO MANAGE</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto scrollbar-thin pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-mono">
                No alerts match the selected filters
              </div>
            ) : (
              filteredAlerts.map((a) => {
                const isSelected = a.id === selectedAlertId;

                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAlertId(a.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40'
                        : 'bg-[#070B13] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold border ${getSeverityColor(a.severity)}`}>
                        {a.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${getStatusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs leading-snug">
                      {a.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{a.location_name}</span>
                      <span>{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Alert Details & Lifecycle State Machine */}
        <div className="lg:col-span-7 bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          {selectedAlert ? (
            <>
              {/* Alert Header */}
              <div className="pb-3 border-b border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity} SEVERITY
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getStatusColor(selectedAlert.status)}`}>
                      STATUS: {selectedAlert.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    ID: <strong>{selectedAlert.id}</strong>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white">
                  {selectedAlert.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedAlert.message}
                </p>
              </div>

              {/* Lifecycle State Machine Controls */}
              <div className="bg-[#070B13] p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  LIFECYCLE TRANSITION COMMANDS:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusTransition(selectedAlert.id, 'ACKNOWLEDGED')}
                    disabled={selectedAlert.status !== 'NEW'}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      selectedAlert.status === 'NEW'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                        : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    1. Acknowledge Alert
                  </button>

                  <button
                    onClick={() => handleStatusTransition(selectedAlert.id, 'IN_PROGRESS')}
                    disabled={selectedAlert.status !== 'ACKNOWLEDGED'}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      selectedAlert.status === 'ACKNOWLEDGED'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                        : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    2. Mark In Progress
                  </button>

                  <button
                    onClick={() => handleStatusTransition(selectedAlert.id, 'RESOLVED')}
                    disabled={selectedAlert.status !== 'IN_PROGRESS'}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      selectedAlert.status === 'IN_PROGRESS'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                        : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    3. Mark Resolved
                  </button>

                  <button
                    onClick={() => handleStatusTransition(selectedAlert.id, 'CLOSED')}
                    disabled={selectedAlert.status !== 'RESOLVED'}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      selectedAlert.status === 'RESOLVED'
                        ? 'bg-slate-700 hover:bg-slate-600 text-white shadow'
                        : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    4. Close Incident
                  </button>
                </div>
              </div>

              {/* Trigger & Incident Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#070B13] border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">THRESHOLD TRIGGER:</span>
                  <p className="text-slate-200 font-sans">{selectedAlert.trigger_reason}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#070B13] border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ASSIGNED FIRST-RESPONDER:</span>
                  <div className="text-cyan-300 font-bold">{selectedAlert.assigned_team}</div>
                  <div className="text-[10px] text-slate-500">Exposed: {selectedAlert.exposed_population.toLocaleString()} citizens</div>
                </div>
              </div>

              {/* Affected Infrastructure List */}
              <div className="p-3.5 rounded-lg bg-[#070B13] border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  AFFECTED CRITICAL INFRASTRUCTURE:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAlert.affected_infrastructure.map((infra, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono">
                      {infra}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Response Actions */}
              <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  MANDATED DISASTER RESPONSE ACTIONS:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {selectedAlert.recommended_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notification Honesty Notice (Section 15 Rule) */}
              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>
                  <strong>Data Honesty Rule:</strong> Internal incident dispatch verified. SMS/Broadcast gateway marked as FUTURE INTEGRATION.
                </span>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select an alert from the register to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
