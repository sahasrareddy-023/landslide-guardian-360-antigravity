// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Command Center Header (Light Theme)
// Operational Identity: NER COMMAND | MDoNER (SIH26001)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Globe, 
  Clock, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  Radio,
  Server
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../lib/i18n';
import { type UserRole } from '../../types';

interface Props {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<Props> = ({
  currentLang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  isOfflineMode,
  onToggleOffline,
  pendingSyncCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentTime(now.toLocaleString('en-IN', options) + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      {/* Top Meta Bar */}
      <div className="px-4 py-1.5 bg-slate-900 text-slate-300 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            MDoNER // SIH 2026 (SIH26001)
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">
            Ministry of Development of North Eastern Region
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{currentTime || 'SYNCHRONIZING...'}</span>
          </div>

          {/* Offline / Online Simulation Toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-colors ${
              isOfflineMode
                ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
            }`}
            title="Toggle simulated field connectivity"
          >
            {isOfflineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isOfflineMode ? 'FIELD: OFFLINE MODE' : 'NETWORK: CONNECTED'}</span>
            {pendingSyncCount > 0 && (
              <span className="ml-1 px-1 rounded-full bg-rose-600 text-[10px] text-white">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Operational Header */}
      <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        {/* Identity & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold tracking-widest border border-blue-200">
                NER COMMAND
              </span>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                LANDSLIDE GUARDIAN 360°
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium tracking-wide">
              AI-Based Early Warning & Landslide Risk Monitoring Center
            </p>
          </div>
        </div>

        {/* Operational Controls: Language & Role */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-mono text-slate-500 font-bold">ROLE:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-xs font-mono font-semibold text-blue-800 focus:outline-none cursor-pointer"
            >
              <option value="OPERATOR">OPERATOR (DUTY)</option>
              <option value="ADMIN">ADMIN (DIRECTOR)</option>
              <option value="FIELD_TEAM">FIELD_TEAM (RANGER)</option>
              <option value="VIEWER">VIEWER (PUBLIC)</option>
            </select>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-mono text-slate-500 font-bold">LANG:</span>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-mono font-semibold text-indigo-800 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Operational Status Ticker Bar — STRICT DATA HONESTY */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between overflow-x-auto gap-3 text-[11px] font-mono scrollbar-thin text-slate-700">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            DATABASE: CONNECTED
          </span>

          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            DATA MODE: SIMULATED DEMONSTRATION
          </span>

          <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <Activity className="w-3 h-3 text-blue-600" />
            RISK ENGINE: ACTIVE
          </span>

          <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
            <Radio className="w-3 h-3 text-indigo-600" />
            ALERT ENGINE: ACTIVE
          </span>

          <span className="flex items-center gap-1.5 text-sky-700 font-semibold">
            <Server className="w-3 h-3 text-sky-600" />
            GIS: ACTIVE
          </span>

          {/* CLEAR DISTINCTION: NEVER FAKE LIVE SENSORS */}
          <span className="flex items-center gap-1.5 text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300 border-dashed">
            <Radio className="w-3 h-3 text-slate-400" />
            EXTERNAL LIVE FEEDS: NOT CONNECTED / FUTURE INTEGRATION
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 whitespace-nowrap text-purple-700 font-semibold">
          <span>AI/ML MODEL: DEMONSTRATION ENGINE</span>
        </div>
      </div>
    </header>
  );
};
