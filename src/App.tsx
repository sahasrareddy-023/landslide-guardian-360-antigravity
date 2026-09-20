// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Root Application Component
// Operational Identity: NER COMMAND
// Problem Statement: SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, ActiveModule } from './components/common/Sidebar';
import { CommandPage } from './pages/CommandPage';
import { MapPage } from './pages/MapPage';
import { RiskPage } from './pages/RiskPage';
import { ImpactPage } from './pages/ImpactPage';
import { PriorityPage } from './pages/PriorityPage';
import { CommunityPage } from './pages/CommunityPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditPage } from './pages/AuditPage';

import { LanguageCode } from './lib/i18n';
import { UserRole } from './types';
import { LocalStore } from './lib/storage';
import { AlertService } from './services/alertService';
import { FieldReportService } from './services/fieldReportService';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('COMMAND');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('OPERATOR');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const refreshCounts = () => {
    setActiveAlertsCount(AlertService.getActiveAlerts().length);
    setPendingReportsCount(FieldReportService.getPendingCount());
    setIsOfflineMode(FieldReportService.isOfflineSimulated());
  };

  useEffect(() => {
    setCurrentLang(LocalStore.getLanguage() as LanguageCode);
    setCurrentRole(LocalStore.getUserRole() as UserRole);
    refreshCounts();

    const interval = setInterval(refreshCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    LocalStore.setLanguage(lang);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    LocalStore.setUserRole(role);
    LocalStore.addAuditLog('ROOT_AUTH', 'USER_ROLE_SWITCHED', { role });
  };

  const handleToggleOffline = () => {
    const next = !isOfflineMode;
    FieldReportService.toggleOfflineSimulation(next);
    setIsOfflineMode(next);
  };

  const handleNavigateWithLocation = (module: ActiveModule, locationId?: string) => {
    if (locationId) setSelectedLocationId(locationId);
    setActiveModule(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Tactical Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isOfflineMode={isOfflineMode}
        onToggleOffline={handleToggleOffline}
        pendingSyncCount={pendingReportsCount}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Tactical Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeAlertsCount={activeAlertsCount}
          pendingReportsCount={pendingReportsCount}
          currentLang={currentLang}
        />

        {/* Dynamic Operational Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-[#070B13] to-[#0A0F1D]">
          {activeModule === 'COMMAND' && (
            <CommandPage onNavigate={handleNavigateWithLocation} />
          )}

          {activeModule === 'MAP' && (
            <MapPage
              selectedLocationId={selectedLocationId}
              onSelectLocation={(id) => setSelectedLocationId(id)}
              onNavigateToModule={(mod) => handleNavigateWithLocation(mod, selectedLocationId)}
            />
          )}

          {activeModule === 'RISK' && (
            <RiskPage selectedLocationId={selectedLocationId} />
          )}

          {activeModule === 'IMPACT' && (
            <ImpactPage onNavigateToRisk={(id) => handleNavigateWithLocation('RISK', id)} />
          )}

          {activeModule === 'PRIORITY' && (
            <PriorityPage />
          )}

          {activeModule === 'COMMUNITY' && (
            <CommunityPage />
          )}

          {activeModule === 'ALERTS' && (
            <AlertsPage />
          )}

          {activeModule === 'ANALYTICS' && (
            <AnalyticsPage />
          )}

          {activeModule === 'AUDIT' && (
            <AuditPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
