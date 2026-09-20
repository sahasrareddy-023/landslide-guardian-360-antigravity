// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Resilient Local & Offline Storage Layer
// Provides full in-browser persistence with initial demonstration seed data
// ==============================================================================

import {
  LocationRecord,
  InfrastructureItem,
  AlertItem,
  FieldReport,
  AuditLog,
  RiskPrediction
} from '../types';

const STORAGE_KEYS = {
  LOCATIONS: 'lg360_locations',
  INFRASTRUCTURE: 'lg360_infrastructure',
  ALERTS: 'lg360_alerts',
  FIELD_REPORTS: 'lg360_field_reports',
  AUDIT_LOGS: 'lg360_audit_logs',
  RISK_PREDICTIONS: 'lg360_risk_predictions',
  SIMULATION_STATE: 'lg360_simulation_state',
  USER_ROLE: 'lg360_user_role',
  LANGUAGE: 'lg360_lang',
  OFFLINE_MODE: 'lg360_offline_simulation'
};

// Initial Demonstration Locations matching prompt specifications
export const INITIAL_LOCATIONS: LocationRecord[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'NH-10 Teesta Valley Corridor',
    state: 'Sikkim / West Bengal Border',
    district: 'Kalimpong',
    latitude: 27.0583,
    longitude: 88.4731,
    terrain_type: 'Steep Gneiss Escarpment & Debris Fan',
    baseline_risk: 'HIGH',
    rainfall: 184.5,
    soil_moisture: 91,
    slope: 42,
    temperature: 18.5,
    exposed_population: 18500,
    villages_count: 8,
    primary_lifeline: 'NH-10 National Arterial Highway',
    road_status: 'RESTRICTED',
    road_name: 'NH-10 Teesta Valley Highway',
    alternate_route: 'Gorubathan-Lava-Algarah State Highway (adds 4.5 hrs)',
    bridges_count: 3,
    hospitals_count: 1,
    schools_count: 6,
    substations_count: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Lunglei South Ridge',
    state: 'Mizoram',
    district: 'Lunglei',
    latitude: 22.8833,
    longitude: 92.7333,
    terrain_type: 'Weathered Sandstone & Siltstone Fold',
    baseline_risk: 'HIGH',
    rainfall: 142.0,
    soil_moisture: 82,
    slope: 38,
    temperature: 21.0,
    exposed_population: 12400,
    villages_count: 5,
    primary_lifeline: 'NH-54 Mizoram Arterial',
    road_status: 'OPEN',
    road_name: 'NH-54 South Ridge Sector',
    alternate_route: 'Thenzawl Bypass',
    bridges_count: 1,
    hospitals_count: 2,
    schools_count: 4,
    substations_count: 1,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Noney Railway Bridge Access',
    state: 'Manipur',
    district: 'Noney',
    latitude: 24.8150,
    longitude: 93.6050,
    terrain_type: 'Dissected Shale & River Canyon',
    baseline_risk: 'MEDIUM',
    rainfall: 98.4,
    soil_moisture: 71,
    slope: 35,
    temperature: 22.5,
    exposed_population: 8200,
    villages_count: 4,
    primary_lifeline: 'Jiribam-Imphal Railway Link Corridor',
    road_status: 'OPEN',
    road_name: 'NH-37 Imphal-Silchar Highway',
    alternate_route: 'Old Cachar Road (restricted heavy freight)',
    bridges_count: 1,
    hospitals_count: 1,
    schools_count: 3,
    substations_count: 1,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Sohra / Cherrapunji',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    latitude: 25.2700,
    longitude: 91.7300,
    terrain_type: 'Limestone Plateau Slope & High Rainfall Basin',
    baseline_risk: 'MEDIUM',
    rainfall: 210.0,
    soil_moisture: 68,
    slope: 26,
    temperature: 17.0,
    exposed_population: 14600,
    villages_count: 9,
    primary_lifeline: 'SH-5 Shillong-Sohra Corridor',
    road_status: 'OPEN',
    road_name: 'SH-5 Plateau Highway',
    alternate_route: 'Mawkdok-Tyngsoh Link',
    bridges_count: 1,
    hospitals_count: 1,
    schools_count: 5,
    substations_count: 2,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Guwahati West-Kamakhya',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    latitude: 26.1667,
    longitude: 91.7000,
    terrain_type: 'Granitic Hill Complex & Urban Slope Fringe',
    baseline_risk: 'LOW',
    rainfall: 45.2,
    soil_moisture: 54,
    slope: 22,
    temperature: 26.0,
    exposed_population: 28000,
    villages_count: 6,
    primary_lifeline: 'Kamakhya Temple Access Arterial & NH-27 Ring',
    road_status: 'OPEN',
    road_name: 'Kamakhya Hill Bypass',
    alternate_route: 'Maligaon-Pandu Road',
    bridges_count: 0,
    hospitals_count: 2,
    schools_count: 8,
    substations_count: 3,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Initial 14 Lifelines tracking: Exactly 6 Bridges & 7 Health Hubs
export const INITIAL_INFRASTRUCTURE: InfrastructureItem[] = [
  // 6 KEY BRIDGES TRACKED
  {
    id: 'inf-br-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Bridges',
    name: 'Teesta Low Dam IV Span Bridge',
    status: 'AT RISK',
    latitude: 27.0620,
    longitude: 88.4710,
    vulnerability: 'HIGH',
    metadata: { bridge_code: 'BR-NER-01', span_m: 180, clearance: 'Restricted under flood watch' }
  },
  {
    id: 'inf-br-02',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Bridges',
    name: 'Birik Dara Gorge Bridge',
    status: 'AT RISK',
    latitude: 27.0490,
    longitude: 88.4680,
    vulnerability: 'HIGH',
    metadata: { bridge_code: 'BR-NER-02', span_m: 95, pier_status: 'Scour monitoring active' }
  },
  {
    id: 'inf-br-03',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Bridges',
    name: 'Rambhi Steel Truss Bridge',
    status: 'OPERATIONAL',
    latitude: 27.0210,
    longitude: 88.4550,
    vulnerability: 'MODERATE',
    metadata: { bridge_code: 'BR-NER-03', span_m: 140, load_capacity: 'Class 70R' }
  },
  {
    id: 'inf-br-04',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Lunglei South Ridge',
    infrastructure_type: 'Bridges',
    name: 'Tlawng River Suspension Bridge',
    status: 'OPERATIONAL',
    latitude: 22.8890,
    longitude: 92.7310,
    vulnerability: 'HIGH',
    metadata: { bridge_code: 'BR-NER-04', span_m: 120, status: 'Cables inspected 2026' }
  },
  {
    id: 'inf-br-05',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Noney Railway Bridge Access',
    infrastructure_type: 'Bridges',
    name: 'Noney Pier 141m Record Railway Bridge',
    status: 'OPERATIONAL',
    latitude: 24.8160,
    longitude: 93.6060,
    vulnerability: 'HIGH',
    metadata: { bridge_code: 'BR-NER-05', span_m: 350, world_record: 'Tallest railway pier' }
  },
  {
    id: 'inf-br-06',
    location_id: '44444444-4444-4444-4444-444444444444',
    location_name: 'Sohra / Cherrapunji',
    infrastructure_type: 'Bridges',
    name: 'Umshiang Double Decker Access Span Bridge',
    status: 'OPERATIONAL',
    latitude: 25.2680,
    longitude: 91.7280,
    vulnerability: 'MODERATE',
    metadata: { bridge_code: 'BR-NER-06', span_m: 85, access: 'Pedestrian & light utility' }
  },

  // 7 HEALTH HUBS TRACKED
  {
    id: 'inf-hh-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Hospitals',
    name: 'Teesta Valley Sub-Divisional Emergency Health Hub',
    status: 'OPERATIONAL',
    latitude: 27.0540,
    longitude: 88.4750,
    vulnerability: 'HIGH',
    metadata: { health_hub_code: 'HH-NER-01', bed_capacity: 60, trauma_unit: true, oxygen_backup: '72h' }
  },
  {
    id: 'inf-hh-02',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Lunglei South Ridge',
    infrastructure_type: 'Hospitals',
    name: 'Lunglei Civil Hospital Regional Health Hub',
    status: 'OPERATIONAL',
    latitude: 22.8810,
    longitude: 92.7350,
    vulnerability: 'MODERATE',
    metadata: { health_hub_code: 'HH-NER-02', bed_capacity: 150, icu_beds: 12 }
  },
  {
    id: 'inf-hh-03',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Lunglei South Ridge',
    infrastructure_type: 'Hospitals',
    name: 'South Mizoram Trauma Health Center',
    status: 'OPERATIONAL',
    latitude: 22.8750,
    longitude: 92.7290,
    vulnerability: 'HIGH',
    metadata: { health_hub_code: 'HH-NER-03', bed_capacity: 45, emergency_ambulances: 4 }
  },
  {
    id: 'inf-hh-04',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Noney Railway Bridge Access',
    infrastructure_type: 'Hospitals',
    name: 'Noney District Health Complex',
    status: 'OPERATIONAL',
    latitude: 24.8120,
    longitude: 93.6020,
    vulnerability: 'MODERATE',
    metadata: { health_hub_code: 'HH-NER-04', bed_capacity: 50, helicopter_evac_point: true }
  },
  {
    id: 'inf-hh-05',
    location_id: '44444444-4444-4444-4444-444444444444',
    location_name: 'Sohra / Cherrapunji',
    infrastructure_type: 'Hospitals',
    name: 'Sohra Community Health Hub',
    status: 'OPERATIONAL',
    latitude: 25.2720,
    longitude: 91.7320,
    vulnerability: 'LOW',
    metadata: { health_hub_code: 'HH-NER-05', bed_capacity: 40, telemedicine_active: true }
  },
  {
    id: 'inf-hh-06',
    location_id: '55555555-5555-5555-5555-555555555555',
    location_name: 'Guwahati West-Kamakhya',
    infrastructure_type: 'Hospitals',
    name: 'Guwahati West Urban Primary Health Hub',
    status: 'OPERATIONAL',
    latitude: 26.1680,
    longitude: 91.7020,
    vulnerability: 'LOW',
    metadata: { health_hub_code: 'HH-NER-06', bed_capacity: 80, ambulance_fleet: 6 }
  },
  {
    id: 'inf-hh-07',
    location_id: '55555555-5555-5555-5555-555555555555',
    location_name: 'Guwahati West-Kamakhya',
    infrastructure_type: 'Hospitals',
    name: 'Kamakhya Hill Emergency First-Aid Hub',
    status: 'OPERATIONAL',
    latitude: 26.1650,
    longitude: 91.6980,
    vulnerability: 'LOW',
    metadata: { health_hub_code: 'HH-NER-07', bed_capacity: 30, pilgrims_triage: true }
  },

  // Additional 14-Lifeline Categories
  {
    id: 'inf-rd-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Major Roads',
    name: 'NH-10 National Arterial Highway',
    status: 'RESTRICTED',
    latitude: 27.0583,
    longitude: 88.4731,
    vulnerability: 'CRITICAL',
    metadata: { daily_pcu: 14000, freight_lifeline_sikkim: true }
  },
  {
    id: 'inf-sc-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Schools',
    name: 'Kalimpong Foothills Senior Secondary School',
    status: 'OPERATIONAL',
    latitude: 27.0600,
    longitude: 88.4780,
    vulnerability: 'MODERATE',
    metadata: { students_count: 420, evacuation_shelter: true }
  },
  {
    id: 'inf-pw-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Power',
    name: 'Rammam Grid Substation 132kV',
    status: 'OPERATIONAL',
    latitude: 27.0510,
    longitude: 88.4620,
    vulnerability: 'HIGH',
    metadata: { transformer_banks: 3, grid_zone: 'North Bengal & Sikkim' }
  },
  {
    id: 'inf-tc-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Telecommunications',
    name: 'BSNL Teesta Optical Fiber Repeater Station',
    status: 'OPERATIONAL',
    latitude: 27.0590,
    longitude: 88.4720,
    vulnerability: 'HIGH',
    metadata: { microwave_link: 'ACTIVE_BACKUP', optical_redundancy: true }
  },
  {
    id: 'inf-wt-01',
    location_id: '44444444-4444-4444-4444-444444444444',
    location_name: 'Sohra / Cherrapunji',
    infrastructure_type: 'Water Supply',
    name: 'Cherrapunji Water Treatment & Reservoir Plant',
    status: 'OPERATIONAL',
    latitude: 25.2710,
    longitude: 91.7340,
    vulnerability: 'LOW',
    metadata: { daily_capacity_mld: 8.5 }
  },
  {
    id: 'inf-em-01',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    infrastructure_type: 'Emergency Services',
    name: 'Kalimpong SDRF Forward Quick-Response Staging Post',
    status: 'OPERATIONAL',
    latitude: 27.0570,
    longitude: 88.4760,
    vulnerability: 'MODERATE',
    metadata: { cutters_hydraulic: true, boats_inflatable: 2 }
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-001',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    severity: 'HIGH',
    title: 'HIGH LANDSLIDE RISK — NH-10 TEESTA VALLEY CORRIDOR',
    message: 'Continuous antecedent rainfall (184.5 mm/24h) and 91% soil saturation have breached safety threshold along vulnerable KM 28-35 stretch.',
    trigger_reason: 'Antecedent precipitation 184.5 mm > 150 mm threshold AND soil moisture 91% > 85% safety threshold.',
    status: 'NEW',
    assigned_team: 'Kalimpong SDRF Quick Response Unit 04',
    exposed_population: 18500,
    affected_infrastructure: ['NH-10 Highway KM 29', 'Teesta Low Dam IV Span Bridge', 'Birik Dara Gorge Bridge'],
    recommended_actions: [
      'Monitor NH-10 corridor with round-the-clock drone patrols',
      'Inspect vulnerable cut-slope at Birik Dara',
      'Verify road status and prepare heavy earthmoving clearance machinery',
      'Notify District Magistrate & responsible emergency response teams',
      'Prepare alternate access route via Gorubathan-Lava'
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        action: 'Alert automatically generated by Demonstration Risk Engine',
        user: 'SYSTEM_RISK_ENGINE'
      }
    ]
  },
  {
    id: 'alt-002',
    location_id: '22222222-2222-2222-2222-222222222222',
    location_name: 'Lunglei South Ridge',
    severity: 'HIGH',
    title: 'ELEVATED SLOPE INSTABILITY — LUNGLEI SOUTH RIDGE',
    message: 'Deep weathered sandstone slope showing signs of waterlogging; localized soil creep reported near South Ridge colony.',
    trigger_reason: 'Cumulative 48h rainfall reached 142.0 mm with 82% soil moisture on 38° slope angle.',
    status: 'ACKNOWLEDGED',
    assigned_team: 'Mizoram SDMA District Cell',
    exposed_population: 12400,
    affected_infrastructure: ['Tlawng River Suspension Bridge', 'South Mizoram Trauma Health Center'],
    recommended_actions: [
      'Issue advisory to hillside residential wards 4 & 5',
      'Deploy visual crack monitoring gauges on the upper scarp',
      'Prepare emergency shelter at Lunglei High School'
    ],
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    acknowledged_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        action: 'Alert generated',
        user: 'SYSTEM_RISK_ENGINE'
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        action: 'Acknowledged by Duty Officer',
        user: 'OPERATOR_LUNGLEI'
      }
    ]
  }
];

export const INITIAL_FIELD_REPORTS: FieldReport[] = [
  {
    id: 'fr-101',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    reporter_id: 'PWD_RANGER_KALIMPONG_02',
    report_type: 'SLOPE CRACK',
    description: 'Visible 12-meter transverse tension crack observed above Birik Dara cut-slope. Continuous water seepage emerging through retaining wall weep holes with minor gravel shedding.',
    latitude: 27.0512,
    longitude: 88.4705,
    severity: 'HIGH',
    road_condition: 'RESTRICTED',
    status: 'VERIFIED',
    sync_status: 'SYNCED',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'fr-102',
    location_id: '33333333-3333-3333-3333-333333333333',
    location_name: 'Noney Railway Bridge Access',
    reporter_id: 'CITIZEN_VILLAGE_LEADER',
    report_type: 'ROAD BLOCKAGE',
    description: 'Minor boulder fall on old approach track 800m north of Pier 141. Single lane blocked for light vehicles.',
    latitude: 24.8165,
    longitude: 93.6048,
    severity: 'MEDIUM',
    road_condition: 'RESTRICTED',
    status: 'VERIFIED',
    sync_status: 'SYNCED',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    user_id: 'NER_COMMAND_ROOT',
    action_type: 'SYSTEM_INITIALIZATION',
    details: {
      event: 'NER COMMAND platform activated with 5 strategic NER locations',
      framework: '14-Lifeline Framework initialized (6 Bridges, 7 Health Hubs)',
      engine: 'Demonstration Risk Engine v1.2 Active'
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'aud-002',
    user_id: 'OPERATOR_LUNGLEI',
    action_type: 'ALERT_STATUS_UPDATE',
    details: {
      alert_id: 'alt-002',
      from_status: 'NEW',
      to_status: 'ACKNOWLEDGED',
      notes: 'SDMA field team deployed for visual crack inspection'
    },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

// In-memory / LocalStorage state management
export class LocalStore {
  static getLocations(): LocationRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (!raw) {
      this.saveLocations(INITIAL_LOCATIONS);
      return INITIAL_LOCATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOCATIONS;
    }
  }

  static saveLocations(data: LocationRecord[]) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(data));
  }

  static updateLocation(id: string, updates: Partial<LocationRecord>): LocationRecord | null {
    const list = this.getLocations();
    const idx = list.findIndex(l => l.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    this.saveLocations(list);
    return list[idx];
  }

  static getInfrastructure(): InfrastructureItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INFRASTRUCTURE);
    if (!raw) {
      this.saveInfrastructure(INITIAL_INFRASTRUCTURE);
      return INITIAL_INFRASTRUCTURE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INFRASTRUCTURE;
    }
  }

  static saveInfrastructure(data: InfrastructureItem[]) {
    localStorage.setItem(STORAGE_KEYS.INFRASTRUCTURE, JSON.stringify(data));
  }

  static getAlerts(): AlertItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      this.saveAlerts(INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ALERTS;
    }
  }

  static saveAlerts(data: AlertItem[]) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(data));
  }

  static addAlert(alert: AlertItem) {
    const list = this.getAlerts();
    list.unshift(alert);
    this.saveAlerts(list);
    this.addAuditLog('SYSTEM_RISK_ENGINE', 'ALERT_CREATED', { alert_id: alert.id, title: alert.title, severity: alert.severity });
  }

  static updateAlertStatus(id: string, status: AlertItem['status'], user = 'SYSTEM_OPERATOR'): AlertItem | null {
    const list = this.getAlerts();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const oldStatus = list[idx].status;
    list[idx].status = status;
    if (status === 'ACKNOWLEDGED' && !list[idx].acknowledged_at) {
      list[idx].acknowledged_at = new Date().toISOString();
    }
    if ((status === 'RESOLVED' || status === 'CLOSED') && !list[idx].resolved_at) {
      list[idx].resolved_at = new Date().toISOString();
    }
    if (!list[idx].history) list[idx].history = [];
    list[idx].history.push({
      timestamp: new Date().toISOString(),
      action: `Status changed from ${oldStatus} to ${status}`,
      user
    });
    this.saveAlerts(list);
    this.addAuditLog(user, 'ALERT_STATUS_UPDATE', { alert_id: id, from: oldStatus, to: status });
    return list[idx];
  }

  static getFieldReports(): FieldReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FIELD_REPORTS);
    if (!raw) {
      this.saveFieldReports(INITIAL_FIELD_REPORTS);
      return INITIAL_FIELD_REPORTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FIELD_REPORTS;
    }
  }

  static saveFieldReports(data: FieldReport[]) {
    localStorage.setItem(STORAGE_KEYS.FIELD_REPORTS, JSON.stringify(data));
  }

  static addFieldReport(report: FieldReport) {
    const list = this.getFieldReports();
    list.unshift(report);
    this.saveFieldReports(list);
    this.addAuditLog(report.reporter_id, 'FIELD_REPORT_SUBMITTED', {
      report_id: report.id,
      report_type: report.report_type,
      location: report.location_name || 'Geo-tagged coordinates',
      sync_status: report.sync_status
    });
  }

  static syncPendingReports(): number {
    const list = this.getFieldReports();
    let count = 0;
    const updated = list.map(r => {
      if (r.sync_status === 'PENDING SYNC' || r.sync_status === 'RETRY') {
        count++;
        return { ...r, sync_status: 'SYNCED' as const };
      }
      return r;
    });
    if (count > 0) {
      this.saveFieldReports(updated);
      this.addAuditLog('OFFLINE_SYNC_ENGINE', 'REPORTS_SYNCHRONIZED', { synced_count: count });
    }
    return count;
  }

  static getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      this.saveAuditLogs(INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  static saveAuditLogs(data: AuditLog[]) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(data));
  }

  static addAuditLog(user_id: string, action_type: string, details: Record<string, any>) {
    const list = this.getAuditLogs();
    const log: AuditLog = {
      id: 'aud-' + Math.random().toString(36).substring(2, 9),
      user_id,
      action_type,
      details,
      created_at: new Date().toISOString()
    };
    list.unshift(log);
    if (list.length > 200) list.pop(); // keep recent 200
    this.saveAuditLogs(list);
  }

  // Simulation State
  static isSimulating(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIMULATION_STATE) === 'active';
  }

  static setSimulationState(active: boolean) {
    if (active) {
      localStorage.setItem(STORAGE_KEYS.SIMULATION_STATE, 'active');
    } else {
      localStorage.removeItem(STORAGE_KEYS.SIMULATION_STATE);
    }
  }

  // Offline Simulation Mode Toggle
  static isOfflineSimulated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';
  }

  static setOfflineSimulated(val: boolean) {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, val ? 'true' : 'false');
  }

  // User Role
  static getUserRole(): string {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'OPERATOR';
  }

  static setUserRole(role: string) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  }

  // Language
  static getLanguage(): string {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  }

  static setLanguage(lang: string) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  // Reset entirely back to pristine initial state
  static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.INFRASTRUCTURE);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.FIELD_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_STATE);
    this.saveLocations(INITIAL_LOCATIONS);
    this.saveInfrastructure(INITIAL_INFRASTRUCTURE);
    this.saveAlerts(INITIAL_ALERTS);
    this.saveFieldReports(INITIAL_FIELD_REPORTS);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
  }
}
