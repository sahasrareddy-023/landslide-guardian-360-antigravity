// ==============================================================================
// LANDSLIDE GUARDIAN 360° — Express API Backend Server
// SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
// ==============================================================================

import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory representation seeded for server-side REST API
let locations = [
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
    alternate_route: 'Gorubathan-Lava-Algarah State Highway',
    bridges_count: 3,
    hospitals_count: 1,
    schools_count: 6,
    substations_count: 2,
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
    alternate_route: 'Old Cachar Road',
    bridges_count: 1,
    hospitals_count: 1,
    schools_count: 3,
    substations_count: 1,
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
    updated_at: new Date().toISOString()
  }
];

let alerts = [
  {
    id: 'alt-001',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    severity: 'HIGH',
    title: 'HIGH LANDSLIDE RISK — NH-10 TEESTA VALLEY CORRIDOR',
    message: 'Continuous antecedent precipitation (184.5 mm/24h) and 91% soil saturation have breached safety threshold along vulnerable KM 28-35 stretch.',
    trigger_reason: 'Antecedent precipitation 184.5 mm > 150 mm AND soil moisture 91% > 85%',
    status: 'NEW',
    assigned_team: 'Kalimpong SDRF Quick Response Unit 04',
    exposed_population: 18500,
    affected_infrastructure: ['NH-10 Highway KM 29', 'Teesta Low Dam IV Span Bridge', 'Birik Dara Gorge Bridge'],
    recommended_actions: [
      'Monitor NH-10 corridor with round-the-clock drone patrols',
      'Inspect vulnerable cut-slope at Birik Dara',
      'Verify road status and prepare heavy earthmoving clearance machinery',
      'Notify District Magistrate & emergency response teams'
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

let fieldReports = [
  {
    id: 'fr-101',
    location_id: '11111111-1111-1111-1111-111111111111',
    location_name: 'NH-10 Teesta Valley Corridor',
    reporter_id: 'PWD_RANGER_KALIMPONG_02',
    report_type: 'SLOPE CRACK',
    description: 'Visible 12-meter transverse tension crack observed above Birik Dara cut-slope.',
    latitude: 27.0512,
    longitude: 88.4705,
    severity: 'HIGH',
    road_condition: 'RESTRICTED',
    status: 'VERIFIED',
    sync_status: 'SYNCED',
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
];

// System Status & Health Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    system: 'LANDSLIDE GUARDIAN 360°',
    operational_identity: 'NER COMMAND',
    database_status: 'CONNECTED (SQL/IN-MEMORY DUAL ENGINE)',
    data_mode: 'SIMULATED DEMONSTRATION DATA',
    risk_engine: 'ACTIVE (DEMONSTRATION ENGINE v1.2)',
    future_ai_ml_contract: 'ACTIVE (POST /api/risk/predict)',
    external_live_feeds: 'NOT CONNECTED / FUTURE INTEGRATION',
    timestamp: new Date().toISOString()
  });
});

// GET /api/locations
app.get('/api/locations', (_req: Request, res: Response) => {
  res.json(locations);
});

// GET /api/locations/:id
app.get('/api/locations/:id', (req: Request, res: Response) => {
  const loc = locations.find(l => l.id === req.params.id);
  if (!loc) return res.status(404).json({ error: 'Location not found' });
  res.json(loc);
});

// GET /api/locations/:id/risk
app.get('/api/locations/:id/risk', (req: Request, res: Response) => {
  const loc = locations.find(l => l.id === req.params.id);
  if (!loc) return res.status(404).json({ error: 'Location not found' });

  const rainfallFactor = Math.round(Math.min(loc.rainfall / 250, 1.0) * 35);
  const moistureFactor = Math.round(Math.min(loc.soil_moisture / 100, 1.0) * 30);
  const slopeFactor = Math.round(Math.min(loc.slope / 50, 1.0) * 20);
  const histFactor = loc.baseline_risk === 'HIGH' ? 8 : loc.baseline_risk === 'CRITICAL' ? 10 : 5;
  const score = Math.min(rainfallFactor + moistureFactor + slopeFactor + histFactor + 5, 100);

  res.json({
    location_id: loc.id,
    risk_score: score,
    risk_level: score >= 90 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW',
    confidence: 0.88,
    contributing_factors: {
      rainfall_factor: rainfallFactor,
      soil_moisture_factor: moistureFactor,
      slope_factor: slopeFactor,
      historical_factor: histFactor,
      terrain_factor: 5
    },
    model_version: 'DEMONSTRATION ENGINE v1.2',
    prediction_time: new Date().toISOString()
  });
});

// GET /api/alerts
app.get('/api/alerts', (_req: Request, res: Response) => {
  res.json(alerts);
});

// POST /api/alerts
app.post('/api/alerts', (req: Request, res: Response) => {
  const newAlert = {
    id: 'alt-' + Math.random().toString(36).substring(2, 8),
    created_at: new Date().toISOString(),
    ...req.body
  };
  alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

// PATCH /api/alerts/:id/status
app.patch('/api/alerts/:id/status', (req: Request, res: Response) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.status = req.body.status;
  res.json(alert);
});

// GET /api/field-reports
app.get('/api/field-reports', (_req: Request, res: Response) => {
  res.json(fieldReports);
});

// POST /api/field-reports
app.post('/api/field-reports', (req: Request, res: Response) => {
  const report = {
    id: 'fr-' + Math.random().toString(36).substring(2, 8),
    created_at: new Date().toISOString(),
    status: 'SUBMITTED',
    sync_status: 'SYNCED',
    ...req.body
  };
  fieldReports.unshift(report);
  res.status(201).json(report);
});

// POST /api/risk/predict — The Future AI/ML Contract Endpoint
app.post('/api/risk/predict', (req: Request, res: Response) => {
  const { rainfall, soil_moisture, slope } = req.body;
  if (rainfall === undefined || soil_moisture === undefined || slope === undefined) {
    return res.status(400).json({ error: 'Missing required inputs: rainfall, soil_moisture, slope' });
  }

  const rainF = Math.round(Math.min(rainfall / 250, 1.0) * 35);
  const soilF = Math.round(Math.min(soil_moisture / 100, 1.0) * 30);
  const slopeF = Math.round(Math.min(slope / 50, 1.0) * 20);
  const score = Math.min(rainF + soilF + slopeF + 10, 100);

  res.json({
    risk_score: score,
    risk_level: score >= 90 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW',
    confidence: 0.91,
    contributing_factors: {
      rainfall_factor: rainF,
      soil_moisture_factor: soilF,
      slope_factor: slopeF,
      historical_factor: 7,
      terrain_factor: 3
    },
    model_version: 'DEMONSTRATION ENGINE v1.2 (FASTAPI ARCHITECTURE COMPATIBLE)',
    prediction_time: new Date().toISOString()
  });
});

// POST /api/demo/run — Simulated Escalation
app.post('/api/demo/run', (_req: Request, res: Response) => {
  const nh10 = locations.find(l => l.id === '11111111-1111-1111-1111-111111111111');
  if (nh10) {
    nh10.rainfall = 245.8;
    nh10.soil_moisture = 97.0;
    nh10.road_status = 'BLOCKED';
    nh10.updated_at = new Date().toISOString();
  }
  res.json({ message: 'Simulation deterioration executed', location: nh10 });
});

// POST /api/demo/reset — Simulated Reset
app.post('/api/demo/reset', (_req: Request, res: Response) => {
  const nh10 = locations.find(l => l.id === '11111111-1111-1111-1111-111111111111');
  if (nh10) {
    nh10.rainfall = 184.5;
    nh10.soil_moisture = 91.0;
    nh10.road_status = 'RESTRICTED';
    nh10.updated_at = new Date().toISOString();
  }
  res.json({ message: 'Simulation scenario reset to baseline', location: nh10 });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NER COMMAND] Landslide Guardian 360 API Server running on port ${PORT}`);
});

