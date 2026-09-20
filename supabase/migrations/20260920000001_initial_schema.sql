-- ==============================================================================
-- LANDSLIDE GUARDIAN 360° — AI-Based Early Warning & Landslide Risk Monitoring Center
-- Operational Identity: NER COMMAND
-- SIH26001 — Ministry of Development of North Eastern Region (MDoNER)
-- Initial Schema Migration: 20260920000001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    terrain_type VARCHAR(100) NOT NULL,
    baseline_risk VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_baseline ON locations(baseline_risk);

-- 2. SENSOR READINGS TABLE
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    rainfall DOUBLE PRECISION NOT NULL, -- mm/24h
    soil_moisture DOUBLE PRECISION NOT NULL, -- percentage
    slope DOUBLE PRECISION NOT NULL, -- degrees
    temperature DOUBLE PRECISION, -- celsius
    reading_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_type VARCHAR(50) NOT NULL DEFAULT 'SIMULATED DEMONSTRATION DATA'
);

CREATE INDEX IF NOT EXISTS idx_sensor_location ON sensor_readings(location_id);
CREATE INDEX IF NOT EXISTS idx_sensor_time ON sensor_readings(reading_time DESC);

-- 3. RISK PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    contributing_factors JSONB NOT NULL DEFAULT '{}'::jsonb,
    model_version VARCHAR(100) NOT NULL DEFAULT 'DEMONSTRATION ENGINE v1.2',
    prediction_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_location ON risk_predictions(location_id);
CREATE INDEX IF NOT EXISTS idx_risk_level ON risk_predictions(risk_level);

-- 4. INFRASTRUCTURE & 14-LIFELINES TABLE
CREATE TABLE IF NOT EXISTS infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    infrastructure_type VARCHAR(50) NOT NULL, -- e.g. Major Roads, Bridges, Hospitals, Schools
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL', -- OPERATIONAL, AT RISK, RESTRICTED, BLOCKED
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    vulnerability VARCHAR(20) NOT NULL DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, CRITICAL
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_infra_location ON infrastructure(location_id);
CREATE INDEX IF NOT EXISTS idx_infra_type ON infrastructure(infrastructure_type);
CREATE INDEX IF NOT EXISTS idx_infra_status ON infrastructure(status);

-- 5. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    risk_prediction_id UUID REFERENCES risk_predictions(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_team VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_location ON alerts(location_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);

-- 6. FIELD REPORTS TABLE
CREATE TABLE IF NOT EXISTS field_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    reporter_id VARCHAR(100) NOT NULL DEFAULT 'FIELD_OFFICER_01',
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('SLOPE CRACK', 'SLOPE MOVEMENT', 'LANDSLIDE', 'ROAD BLOCKAGE', 'INFRASTRUCTURE DAMAGE', 'OTHER')),
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    media_url TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    road_condition VARCHAR(50) DEFAULT 'RESTRICTED',
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    sync_status VARCHAR(20) NOT NULL DEFAULT 'SYNCED' CHECK (sync_status IN ('SYNCED', 'PENDING SYNC', 'SYNC FAILED', 'RETRY')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_reports_location ON field_reports(location_id);
CREATE INDEX IF NOT EXISTS idx_field_reports_sync ON field_reports(sync_status);

-- 7. ACTION RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS action_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'HIGH' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DEPLOYED', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_alert ON action_recommendations(alert_id);

-- 8. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR', 'FIELD_TEAM', 'VIEWER')),
    department VARCHAR(150) NOT NULL DEFAULT 'State Disaster Management Authority',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. USER LOCATION ACCESS TABLE
CREATE TABLE IF NOT EXISTS user_location_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_OPERATOR',
    action_type VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at DESC);

-- 11. SYSTEM CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS system_configuration (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SEED DATA
-- Insert Demo System Configurations
INSERT INTO system_configuration (key, value, description)
VALUES 
('operational_mode', '{"mode": "SIMULATED DEMONSTRATION", "label": "SIMULATED DEMONSTRATION DATA"}'::jsonb, 'Operational Data Honesty Configuration'),
('ai_engine', '{"engine": "DEMONSTRATION ENGINE v1.2", "future_endpoint": "/api/risk/predict"}'::jsonb, 'AI/ML Model Status')
ON CONFLICT (key) DO NOTHING;

-- Insert Demonstration Locations
INSERT INTO locations (id, name, state, district, latitude, longitude, terrain_type, baseline_risk)
VALUES 
('11111111-1111-1111-1111-111111111111', 'NH-10 Teesta Valley Corridor', 'Sikkim / West Bengal Border', 'Kalimpong', 27.0583, 88.4731, 'Steep Gneiss Escarpment & Debris Fan', 'HIGH'),
('22222222-2222-2222-2222-222222222222', 'Lunglei South Ridge', 'Mizoram', 'Lunglei', 22.8833, 92.7333, 'Weathered Sandstone & Siltstone Fold', 'HIGH'),
('33333333-3333-3333-3333-333333333333', 'Noney Railway Bridge Access', 'Manipur', 'Noney', 24.8150, 93.6050, 'Dissected Shale & River Canyon', 'MEDIUM'),
('44444444-4444-4444-4444-444444444444', 'Sohra / Cherrapunji', 'Meghalaya', 'East Khasi Hills', 25.2700, 91.7300, 'Limestone Plateau Slope & High Rainfall Basin', 'MEDIUM'),
('55555555-5555-5555-5555-555555555555', 'Guwahati West-Kamakhya', 'Assam', 'Kamrup Metropolitan', 26.1667, 91.7000, 'Granitic Hill Complex & Urban Slope Fringe', 'LOW')
ON CONFLICT (id) DO NOTHING;

-- Insert Baseline Sensor Readings
INSERT INTO sensor_readings (location_id, rainfall, soil_moisture, slope, temperature, source_type)
VALUES 
('11111111-1111-1111-1111-111111111111', 184.5, 91.0, 42.0, 18.5, 'SIMULATED DEMONSTRATION DATA'),
('22222222-2222-2222-2222-222222222222', 142.0, 82.0, 38.0, 21.0, 'SIMULATED DEMONSTRATION DATA'),
('33333333-3333-3333-3333-333333333333', 98.4, 71.0, 35.0, 22.5, 'SIMULATED DEMONSTRATION DATA'),
('44444444-4444-4444-4444-444444444444', 210.0, 68.0, 26.0, 17.0, 'SIMULATED DEMONSTRATION DATA'),
('55555555-5555-5555-5555-555555555555', 45.2, 54.0, 22.0, 26.0, 'SIMULATED DEMONSTRATION DATA');

-- Insert Initial Risk Predictions
INSERT INTO risk_predictions (id, location_id, risk_score, risk_level, confidence, contributing_factors, model_version)
VALUES 
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 88, 'HIGH', 0.89, '{"rainfall_factor": 32, "soil_moisture_factor": 28, "slope_factor": 18, "historical_factor": 10}'::jsonb, 'DEMONSTRATION ENGINE v1.2'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 76, 'HIGH', 0.84, '{"rainfall_factor": 24, "soil_moisture_factor": 24, "slope_factor": 18, "historical_factor": 10}'::jsonb, 'DEMONSTRATION ENGINE v1.2'),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 64, 'MEDIUM', 0.81, '{"rainfall_factor": 18, "soil_moisture_factor": 20, "slope_factor": 16, "historical_factor": 10}'::jsonb, 'DEMONSTRATION ENGINE v1.2'),
('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 58, 'MEDIUM', 0.80, '{"rainfall_factor": 25, "soil_moisture_factor": 15, "slope_factor": 10, "historical_factor": 8}'::jsonb, 'DEMONSTRATION ENGINE v1.2'),
('a5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 44, 'LOW', 0.78, '{"rainfall_factor": 10, "soil_moisture_factor": 14, "slope_factor": 10, "historical_factor": 10}'::jsonb, 'DEMONSTRATION ENGINE v1.2');

-- Insert 14 Lifelines / Critical Infrastructure (Including 6 Bridges & 7 Health Hubs)
INSERT INTO infrastructure (location_id, infrastructure_type, name, status, latitude, longitude, vulnerability, metadata)
VALUES 
-- NH-10 Teesta Valley Lifelines
('11111111-1111-1111-1111-111111111111', 'Major Roads', 'NH-10 National Arterial Highway', 'RESTRICTED', 27.0583, 88.4731, 'CRITICAL', '{"alternate_route": "Gorubathan-Lava-Algarah State Highway", "traffic_volume": "12,000 vehicles/day"}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Bridges', 'Teesta Low Dam IV Span Bridge', 'AT RISK', 27.0620, 88.4710, 'HIGH', '{"bridge_code": "BR-NER-01", "span_m": 180}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Bridges', 'Birik Dara Gorge Bridge', 'AT RISK', 27.0490, 88.4680, 'HIGH', '{"bridge_code": "BR-NER-02", "span_m": 95}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Bridges', 'Rambhi Steel Truss Bridge', 'OPERATIONAL', 27.0210, 88.4550, 'MODERATE', '{"bridge_code": "BR-NER-03", "span_m": 140}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Hospitals', 'Teesta Valley Sub-Divisional Emergency Health Hub', 'OPERATIONAL', 27.0540, 88.4750, 'HIGH', '{"bed_capacity": 60, "trauma_unit": true, "health_hub_code": "HH-NER-01"}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Schools', 'Kalimpong Foothills Senior Secondary School', 'OPERATIONAL', 27.0600, 88.4780, 'MODERATE', '{"students": 420, "evacuation_shelter": true}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Power', 'Rammam Grid Substation 132kV', 'OPERATIONAL', 27.0510, 88.4620, 'HIGH', '{"feeder_lines": 4, "backup_genset": true}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'Telecommunications', 'BSNL Teesta Optical Fiber Repeater', 'OPERATIONAL', 27.0590, 88.4720, 'HIGH', '{"status": "BATTERY_BACKUP_ONLINE"}'::jsonb),

-- Lunglei Lifelines
('22222222-2222-2222-2222-222222222222', 'Bridges', 'Tlawng River Suspension Bridge', 'OPERATIONAL', 22.8890, 92.7310, 'HIGH', '{"bridge_code": "BR-NER-04", "span_m": 120}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Hospitals', 'Lunglei Civil Hospital Regional Health Hub', 'OPERATIONAL', 22.8810, 92.7350, 'MODERATE', '{"bed_capacity": 150, "health_hub_code": "HH-NER-02"}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Hospitals', 'South Mizoram Trauma Health Center', 'OPERATIONAL', 22.8750, 92.7290, 'HIGH', '{"bed_capacity": 45, "health_hub_code": "HH-NER-03"}'::jsonb),

-- Noney Lifelines
('33333333-3333-3333-3333-333333333333', 'Bridges', 'Noney Pier 141m Record Railway Bridge', 'OPERATIONAL', 24.8160, 93.6060, 'HIGH', '{"bridge_code": "BR-NER-05", "span_m": 350}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Railways', 'Jiribam-Imphal Railway Link Corridor', 'OPERATIONAL', 24.8140, 93.6040, 'HIGH', '{"track_status": "ACTIVE_FREIGHT"}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Hospitals', 'Noney District Health Complex', 'OPERATIONAL', 24.8120, 93.6020, 'MODERATE', '{"bed_capacity": 50, "health_hub_code": "HH-NER-04"}'::jsonb),

-- Sohra Lifelines
('44444444-4444-4444-4444-444444444444', 'Bridges', 'Umshiang Double Decker Access Span Bridge', 'OPERATIONAL', 25.2680, 91.7280, 'MODERATE', '{"bridge_code": "BR-NER-06", "span_m": 85}'::jsonb),
('44444444-4444-4444-4444-444444444444', 'Hospitals', 'Sohra Community Health Hub', 'OPERATIONAL', 25.2720, 91.7320, 'LOW', '{"bed_capacity": 40, "health_hub_code": "HH-NER-05"}'::jsonb),
('44444444-4444-4444-4444-444444444444', 'Water Supply', 'Cherrapunji Water Distribution Pumping Plant', 'OPERATIONAL', 25.2710, 91.7340, 'LOW', '{"treatment_mld": 8}'::jsonb),

-- Guwahati West-Kamakhya Lifelines
('55555555-5555-5555-5555-555555555555', 'Hospitals', 'Guwahati West Urban Primary Health Hub', 'OPERATIONAL', 26.1680, 91.7020, 'LOW', '{"bed_capacity": 80, "health_hub_code": "HH-NER-06"}'::jsonb),
('55555555-5555-5555-5555-555555555555', 'Hospitals', 'Kamakhya Hill Emergency First-Aid Hub', 'OPERATIONAL', 26.1650, 91.6980, 'LOW', '{"bed_capacity": 30, "health_hub_code": "HH-NER-07"}'::jsonb);

-- Insert Initial Alert
INSERT INTO alerts (location_id, severity, title, message, status, assigned_team)
VALUES 
('11111111-1111-1111-1111-111111111111', 'HIGH', 'HIGH LANDSLIDE RISK — NH-10 TEESTA VALLEY CORRIDOR', 'Sustained antecedent precipitation (184.5 mm/24h) and 91% soil saturation have breached safety threshold along vulnerable KM 28-35 stretch.', 'NEW', 'Kalimpong SDRF Unit 04');

-- Insert Initial Field Report
INSERT INTO field_reports (location_id, report_type, description, latitude, longitude, severity, road_condition, status, sync_status)
VALUES 
('11111111-1111-1111-1111-111111111111', 'SLOPE CRACK', 'Visible 12-meter transverse tension crack observed above Birik Dara cut-slope. Minor debris shedding onto road berm.', 27.0512, 88.4705, 'HIGH', 'RESTRICTED', 'VERIFIED', 'SYNCED');

-- Insert Action Recommendation
INSERT INTO action_recommendations (location_id, recommendation, priority, status)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Deploy highway patrol to Birik Dara; enforce one-way convoy movement; alert PWD heavy earthmovers at 29th Mile.', 'HIGH', 'DEPLOYED');

-- Insert Audit Log
INSERT INTO audit_logs (user_id, action_type, details)
VALUES 
('NER_COMMAND_ROOT', 'SYSTEM_INITIALIZATION', '{"event": "System initialized with 5 NER locations, 14-lifeline inventory, and active demonstration risk engine"}'::jsonb);
