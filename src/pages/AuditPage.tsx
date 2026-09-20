// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Module 9: Tamper-Evident Operational Audit Log
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Clock, 
  UserCheck, 
  Filter, 
  CheckCircle2, 
  Activity,
  Download
} from 'lucide-react';
import { AuditLog } from '../types';
import { AuditService } from '../services/auditService';
import { DataHonestyBadge } from '../components/common/DataHonestyBadge';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const refreshData = () => {
    setLogs(AuditService.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredLogs = logs.filter(l => {
    if (filterAction !== 'ALL' && l.action_type !== filterAction) return false;
    return true;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NER_COMMAND_AUDIT_LOG_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              OPERATIONAL AUDIT LOG & TAMPER-EVIDENT TRAIL
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Cryptographically Ordered Historical Record of Emergency Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataHonestyBadge type="DATABASE CONNECTED" />
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table Container */}
      <div className="bg-[#0C1322] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">FILTER ACTION:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-cyan-300 font-semibold rounded px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="ALL">ALL OPERATIONAL ACTIONS</option>
              <option value="SYSTEM_INITIALIZATION">SYSTEM_INITIALIZATION</option>
              <option value="ALERT_STATUS_UPDATE">ALERT_STATUS_UPDATE</option>
              <option value="ALERT_CREATED">ALERT_CREATED</option>
              <option value="FIELD_REPORT_SUBMITTED">FIELD_REPORT_SUBMITTED</option>
              <option value="REPORTS_SYNCHRONIZED">REPORTS_SYNCHRONIZED</option>
              <option value="SIMULATION_SCENARIO_STARTED">SIMULATION_SCENARIO_STARTED</option>
              <option value="SIMULATION_SCENARIO_RESET">SIMULATION_SCENARIO_RESET</option>
            </select>
          </div>

          <span className="text-xs font-mono text-slate-400">
            TOTAL LOGGED ENTRIES: <strong className="text-white">{filteredLogs.length}</strong>
          </span>
        </div>

        <div className="space-y-2.5 max-h-[650px] overflow-y-auto scrollbar-thin pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-lg bg-[#070B13] border border-slate-800 space-y-2 text-xs font-mono"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-[10px]">
                    {log.action_type}
                  </span>
                  <span className="text-slate-300 font-bold">
                    By: <strong className="text-white">{log.user_id}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* JSON Payload Details */}
              <pre className="p-2.5 rounded bg-slate-900/90 text-slate-300 text-[11px] overflow-x-auto border border-slate-800/80 font-mono">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
