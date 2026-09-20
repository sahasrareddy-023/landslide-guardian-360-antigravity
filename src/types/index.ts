// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Core TypeScript Domain Types
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type RoadStatus = 'OPEN' | 'RESTRICTED' | 'BLOCKED' | 'CRITICAL';
export type SyncStatus = 'SYNCED' | 'PENDING SYNC' | 'SYNC FAILED' | 'RETRY';
export type UserRole = 'ADMIN' | 'OPERATOR' | 'FIELD_TEAM' | 'VIEWER';

export type LifelineCategory = 
  | 'Major Roads'
  | 'Highways'
  | 'Bridges'
  | 'Railways'
  | 'Hospitals'
  | 'Schools'
  | 'Power'
  | 'Telecommunications'
  | 'Water Supply'
  | 'Emergency Services'
  | 'Transport Hubs'
  | 'Government Facilities'
  | 'Evacuation / Access Routes'
  | 'Other Critical Public Infrastructure';

export type FieldReportCategory = 
  | 'SLOPE CRACK'
  | 'SLOPE MOVEMENT'
  | 'LANDSLIDE'
  | 'ROAD BLOCKAGE'
  | 'INFRASTRUCTURE DAMAGE'
  | 'OTHER';

export interface LocationRecord {
  id: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  terrain_type: string;
  baseline_risk: RiskLevel;
  // Dynamic / Telemetry fields
  rainfall: number; // mm in 24h
  soil_moisture: number; // percentage (0-100)
  slope: number; // degrees
  temperature: number; // deg C
  exposed_population: number;
  villages_count: number;
  primary_lifeline: string;
  road_status: RoadStatus;
  road_name: string;
  alternate_route?: string;
  bridges_count: number;
  hospitals_count: number;
  schools_count: number;
  substations_count: number;
  created_at: string;
  updated_at: string;
}

export interface ContributingFactors {
  rainfall_factor: number;      // 0-35
  soil_moisture_factor: number; // 0-30
  slope_factor: number;         // 0-20
  historical_factor: number;    // 0-10
  terrain_factor: number;       // 0-5
}

export interface RiskPrediction {
  id: string;
  location_id: string;
  location_name?: string;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  confidence: number;
  contributing_factors: ContributingFactors;
  model_version: string; // e.g. "DEMONSTRATION ENGINE v1.2"
  prediction_time: string;
}

export interface InfrastructureItem {
  id: string;
  location_id: string;
  location_name?: string;
  infrastructure_type: LifelineCategory;
  name: string;
  status: 'OPERATIONAL' | 'AT RISK' | 'RESTRICTED' | 'BLOCKED';
  latitude: number;
  longitude: number;
  vulnerability: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  metadata: Record<string, any>;
  created_at?: string;
}

export interface AlertItem {
  id: string;
  location_id: string;
  location_name: string;
  risk_prediction_id?: string;
  severity: RiskLevel;
  title: string;
  message: string;
  trigger_reason: string;
  status: AlertStatus;
  assigned_team: string;
  exposed_population: number;
  affected_infrastructure: string[];
  recommended_actions: string[];
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  history?: Array<{
    timestamp: string;
    action: string;
    user: string;
  }>;
}

export interface FieldReport {
  id: string;
  location_id?: string;
  location_name?: string;
  reporter_id: string;
  report_type: FieldReportCategory;
  description: string;
  latitude: number;
  longitude: number;
  media_url?: string;
  severity: RiskLevel;
  road_condition: RoadStatus;
  status: 'SUBMITTED' | 'VERIFIED' | 'RESOLVED';
  sync_status: SyncStatus;
  created_at: string;
}

export interface PriorityAssessment {
  location_id: string;
  location_name: string;
  priority_score: number; // 0 - 100
  priority_level: PriorityLevel;
  risk_score: number;
  exposed_population: number;
  critical_lifelines_count: number;
  road_status: RoadStatus;
  accessibility_score: number; // 0-100 (lower = harder access)
  explanation: string;
  recommended_dispatch: string[];
}

export interface AuditLog {
  id: string;
  user_id: string;
  action_type: string;
  details: Record<string, any>;
  created_at: string;
}

// Future AI/ML API Contract Types
export interface MLPredictRequest {
  location_id: string;
  rainfall: number;
  soil_moisture: number;
  slope: number;
  historical_features: {
    incident_count_10y: number;
    mean_precipitation_monsoon: number;
    lithology_index: number;
  };
  exposure_features: {
    population: number;
    vital_corridor: boolean;
  };
}

export interface MLPredictResponse {
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  contributing_factors: ContributingFactors;
  model_version: string;
  prediction_time: string;
}
