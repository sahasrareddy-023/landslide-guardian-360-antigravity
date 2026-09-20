// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Persistent Command Center Sidebar
// ==============================================================================

import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Users, 
  Bell, 
  LineChart, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../lib/i18n';

export type ActiveModule = 
  | 'COMMAND'
  | 'MAP'
  | 'RISK'
  | 'IMPACT'
  | 'PRIORITY'
  | 'COMMUNITY'
  | 'ALERTS'
  | 'ANALYTICS'
  | 'AUDIT';

interface Props {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeAlertsCount: number;
  pendingReportsCount: number;
  currentLang: LanguageCode;
}

export const Sidebar: React.FC<Props> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  activeAlertsCount,
  pendingReportsCount,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'COMMAND' as ActiveModule, label: t.nav_command || 'COMMAND', icon: LayoutDashboard },
    { id: 'MAP' as ActiveModule, label: t.nav_map || 'MAP', icon: Map },
    { id: 'RISK' as ActiveModule, label: t.nav_risk || 'RISK', icon: Flame },
    { id: 'IMPACT' as ActiveModule, label: t.nav_impact || 'IMPACT', icon: ShieldAlert },
    { id: 'PRIORITY' as ActiveModule, label: t.nav_priority || 'PRIORITY', icon: Zap },
    { 
      id: 'COMMUNITY' as ActiveModule, 
      label: t.nav_community || 'COMMUNITY', 
      icon: Users,
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
      badgeColor: 'bg-cyan-500'
    },
    { 
      id: 'ALERTS' as ActiveModule, 
      label: t.nav_alerts || 'ALERTS', 
      icon: Bell, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-rose-500 animate-pulse'
    },
    { id: 'ANALYTICS' as ActiveModule, label: t.nav_analytics || 'ANALYTICS', icon: LineChart },
    { id: 'AUDIT' as ActiveModule, label: t.nav_audit || 'AUDIT LOG', icon: FileText },
  ];

  return (
    <aside
      className={`bg-[#0B1120] border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-4">
        <div className="px-3 mb-4 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase px-2">
              DISASTER MODULES
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors mx-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left tracking-wide">
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold text-white ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== null && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operational Badge on Footer */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800/80 bg-[#070B13]/60 text-[11px] font-mono text-slate-500">
          <div className="text-slate-400 font-semibold mb-1">MDoNER PROTOCOL</div>
          <div>SIH 2026 / SIH26001</div>
          <div className="text-[10px] text-cyan-500/80 mt-1">SECURE MONITORING ACTIVE</div>
        </div>
      ) : (
        <div className="p-2 text-center text-[10px] font-mono text-slate-600 border-t border-slate-800">
          NER
        </div>
      )}
    </aside>
  );
};
