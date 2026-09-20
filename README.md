# LANDSLIDE GUARDIAN 360°
## AI-Based Early Warning & Landslide Risk Monitoring Center

**Operational Identity:** `NER COMMAND`  
**Problem Statement:** `SIH26001` — AI-Based early warning and landslide Risk Monitoring System in NER  
**Organization:** Ministry of Development of North Eastern Region (`MDoNER`)  
**Theme:** Disaster Management  
**Event:** Smart India Hackathon (SIH) 2026  

---

## 1. Executive Summary

**LANDSLIDE GUARDIAN 360°** is a full-stack disaster-management decision-support platform designed for the North Eastern Region of India (Sikkim, Assam, Meghalaya, Mizoram, Manipur, Nagaland, Arunachal Pradesh, Tripura). It delivers a complete closed-loop operational workflow:

$$\text{Environmental Inputs} \longrightarrow \text{Risk Analysis} \longrightarrow \text{GIS Mapping} \longrightarrow \text{Impact Assessment} \longrightarrow \text{Response Prioritisation} \longrightarrow \text{Early Warning Alerts} \longrightarrow \text{Field Verification} \longrightarrow \text{Closed-Loop Audit}$$

Built with absolute adherence to the **SIH26001 Data-Honesty Rule**, the platform clearly distinguishes between simulated demonstration data, field observations, database records, and future satellite/sensor integrations without fabricating live government feeds.

---

## 2. Key Operational Features & Capabilities

### 1. Command Center (`COMMAND`)
- **Operational Status Ticker**:
  - `DATABASE: CONNECTED`
  - `DATA MODE: SIMULATED DEMONSTRATION`
  - `RISK ENGINE: ACTIVE`
  - `ALERT ENGINE: ACTIVE`
  - `GIS: ACTIVE`
  - `EXTERNAL LIVE FEEDS: NOT CONNECTED / FUTURE INTEGRATION`
- **8 Core KPIs**: Monitored Locations, Active Alerts, Critical Locations, High-Risk Locations, Infrastructure at Risk, Population Exposure, Open Field Reports, Highest Risk Score.
- **Quick Status Cards**: Road Connectivity, 24h Rainfall, Soil Saturation, Emergency Response Priority.
- **Primary Demonstration Corridor Spotlight**: NH-10 Teesta Valley Corridor.

### 2. Multi-Stage Simulation Scenario
- Prominent button: **`RUN SIMULATED DEMO SCENARIO`** (Never called "Live Demo").
- Simulates rapid cloudburst escalation on **NH-10 Teesta Valley Corridor (KM 28–35)**:
  - **Stage 1**: Precipitation accelerates from 184.5 mm to 215.0 mm/24h.
  - **Stage 2**: Regolith saturation exceeds safety threshold (91% $\rightarrow$ 95.8%).
  - **Stage 3**: Risk engine elevates susceptibility (Risk 88 $\rightarrow$ 96, Level: `CRITICAL`).
  - **Stage 4**: Debris flow breaches rockfall barriers; NH-10 road status changes to `BLOCKED`.
  - **Stage 5**: Priority engine escalates to `99 / CRITICAL`.
  - **Stage 6**: Automatic early warning alert generated with response actions for Kalimpong SDRF & NDRF.
- Prominent button: **`RESET DEMO SCENARIO`** rolls back all telemetry to pristine baseline state.

### 3. Tactical GIS Map (`MAP`)
- Interactive Leaflet cartography centered on the North Eastern Region.
- Pulsing risk hotspot markers, color-coded by severity.
- 14-Lifeline asset overlays (Bridges, Health Hubs, Schools, Power).
- Interactive location drawer providing full telemetry, road conditions, and direct module jump links.

### 4. Transparent Risk Analysis Engine (`RISK`)
- Transparent formulation:
  $$\text{Risk Score} = (I_{\text{rain}} \times 35\%) + (I_{\text{soil}} \times 30\%) + (I_{\text{slope}} \times 20\%) + (I_{\text{hist}} \times 10\%) + (I_{\text{terrain}} \times 5\%)$$
- **Future AI/ML Architecture**:
  - Production-ready `POST /api/risk/predict` API contract.
  - Interactive test harness for real-time inference testing.
  - Python FastAPI microservice architecture template (`server/ml_service/mock_ml_contract.py`).

### 5. Impact Assessment & 14-Lifeline Framework (`IMPACT`)
- Clear educational and operational distinction: **Risk** (hazard likelihood) vs **Impact** (consequences to lives and lifelines).
- **14-Lifeline Categories**: Major Roads, Highways, Bridges, Railways, Hospitals, Schools, Power, Telecommunications, Water Supply, Emergency Services, Transport Hubs, Government Facilities, Evacuation Routes, Other Public Assets.
- Highlight metrics: **6 KEY BRIDGES TRACKED** and **7 HEALTH HUBS TRACKED**.

### 6. Emergency Response Prioritisation Engine (`PRIORITY`)
- Multi-factor emergency response calculation combining hazard severity, road blockage, population density, and health hub/bridge exposure.
- Human, jury-understandable explanations:
  > *"Priority Score: 99 (CRITICAL) — High hazard severity (Risk Score 96) + major arterial connectivity disruption (BLOCKED) on vital lifeline NH-10 + high population exposure (18,500 citizens across 8 settlements) + critical vulnerability to 3 bridges & emergency health hub."*
- Direct NDRF/SDRF emergency dispatch orders.

### 7. Community & Field Reporting with Offline Queue (`COMMUNITY`)
- Citizen and forest ranger observation portal (Slope crack, slope movement, landslide, road blockage, infrastructure damage).
- GPS coordinate capture and photo upload simulation.
- **Low-Network / Offline Mode**: Reports entered offline are marked `PENDING SYNC` and stored in local cache until network restoration or manual sync.

### 8. Early Warning Alert Lifecycle (`ALERTS`)
- Full state transition: `NEW` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
- Team assignment, threshold triggers, affected lifelines, and recommended response checklists.

### 9. Disaster Analytics & Trend Forecasting (`ANALYTICS`)
- 24-hour telemetry trend cross-correlating rainfall, soil moisture, and susceptibility.
- **Strict Data-Honesty**: When historical depth is unavailable, displays `INSUFFICIENT DATA` instead of fabricating false trends.

### 10. Operational Audit Log (`AUDIT LOG`)
- Tamper-evident chronological log of system initializations, alert transitions, field reports, and simulation runs with JSON payload export.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet GIS.
- **Backend**: Node.js, Express REST API (`server/index.ts`), Python FastAPI ML Contract (`server/ml_service/mock_ml_contract.py`).
- **Database**: PostgreSQL / Supabase Migration Schema (`supabase/migrations/20260920000001_initial_schema.sql`) + Resilient Local Storage Engine.
- **Internationalization**: Support for 6 languages (English, Hindi, Assamese, Bengali, Malayalam, Telugu).

---

## 4. Database Schema (11 Relational Tables)

1. `locations`: Monitored geographic sectors (id, name, state, district, lat, lng, terrain, baseline_risk).
2. `sensor_readings`: Environmental telemetry (rainfall, soil_moisture, slope, temperature, source_type).
3. `risk_predictions`: Susceptibility outputs (risk_score, risk_level, contributing_factors JSONB, model_version).
4. `infrastructure`: 14-Lifeline assets (infrastructure_type, status, vulnerability, metadata JSONB).
5. `alerts`: Lifecycle records (severity, title, message, status, assigned_team, acknowledged_at, resolved_at).
6. `field_reports`: Citizen & ranger incident submissions (report_type, description, severity, road_condition, sync_status).
7. `action_recommendations`: Mandated disaster response protocols.
8. `profiles`: Operator, Admin, Field Ranger, and Viewer profiles.
9. `user_location_access`: Role-based spatial access control.
10. `audit_logs`: Operational activity trail with JSONB metadata.
11. `system_configuration`: Operational parameters and honesty flags.

---

## 5. Getting Started & Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone or open workspace
cd "Landslide Guardian 360"

# Install dependencies
npm install
```

### Running the Application
```bash
# Option A: Start Frontend Dev Server
npm run dev

# Option B: Start Express REST Backend Server
npm run server

# Option C: Build Production Bundle
npm run build
```

---

## 6. Demonstration Locations (NER)

1. **NH-10 Teesta Valley Corridor (Primary)**:
   - State: Sikkim / West Bengal Border (Kalimpong)
   - Baseline: Risk 88 (HIGH), Rain 184.5 mm/24h, Soil Moisture 91%, Slope 42°
   - Exposed Population: 18,500 citizens across 8 villages
   - Lifelines: NH-10 Highway, 3 Bridges, 1 Hospital, 6 Schools, 2 Substations
2. **Lunglei South Ridge**: Mizoram (Risk 76, HIGH)
3. **Noney Railway Bridge Access**: Manipur (Risk 64, MEDIUM)
4. **Sohra / Cherrapunji**: Meghalaya (Risk 58, Rain 210 mm)
5. **Guwahati West-Kamakhya**: Assam (Risk 44, LOW)

---

## 7. SIH Jury Demonstration Flow (Step-by-Step)

1. **Launch App**: Observe the `NER COMMAND` header and operational status indicators (`DATABASE: CONNECTED`, `DATA MODE: SIMULATED DEMONSTRATION`, `RISK ENGINE: ACTIVE`).
2. **Explore Executive KPIs**: Review the 8 operational KPI cards and the road connectivity status.
3. **Open GIS Map (`MAP`)**: Inspect the North Eastern Region cartography, click on **NH-10 Teesta Valley Corridor**, and explore the slide-out Location Detail Drawer showing live telemetry and lifelines.
4. **Inspect Risk Formulation (`RISK`)**: Review the transparent mathematical breakdown and switch to the **Future AI/ML Architecture** tab to test the `POST /api/risk/predict` API contract.
5. **Inspect 14-Lifelines (`IMPACT`)**: Review the 14-lifeline matrix with **6 KEY BRIDGES TRACKED** and **7 HEALTH HUBS TRACKED**.
6. **Evaluate Emergency Priority (`PRIORITY`)**: Review the multi-factor triage score and the plain-English explanation generated for authorities.
7. **Manage Alerts (`ALERTS`)**: Review the active alerts and demonstrate transitioning an alert through `ACKNOWLEDGED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`.
8. **Field Reporting & Offline Test (`COMMUNITY`)**: Submit a new geo-tagged slope observation, toggle offline mode to demonstrate local `PENDING SYNC` queuing, and click `Sync Now`.
9. **Execute Multi-Stage Simulation (`COMMAND`)**: Click **`RUN SIMULATED DEMO SCENARIO`**:
   - Watch rainfall surge: $184.5 \rightarrow 245.8\text{ mm/24h}$
   - Watch soil moisture breach saturation: $91\% \rightarrow 97\%$
   - Watch risk score climb: $88 \rightarrow 96\text{ (CRITICAL)}$
   - Watch road status change to `BLOCKED` and emergency priority hit `99 / CRITICAL`
   - Observe automatic alert generation for Kalimpong SDRF & NDRF
   - Click **`RESET DEMO SCENARIO`** to demonstrate full state recovery.

---

## 8. Implemented vs Future Integrations

| Feature Component | Status | Operational Classification |
| :--- | :--- | :--- |
| **Executive Command Dashboard** | ✅ Implemented | Live Operational Core |
| **Tactical Leaflet GIS Map** | ✅ Implemented | Live Operational Core |
| **Transparent Multi-Factor Risk Engine** | ✅ Implemented | Demonstration Engine v1.2 |
| **14-Lifeline Infrastructure Matrix** | ✅ Implemented | Live Operational Core |
| **6 Bridges & 7 Health Hubs Tracking** | ✅ Implemented | Live Operational Core |
| **Multi-Stage Deterioration Simulation** | ✅ Implemented | Simulated Demonstration Scenario |
| **Emergency Prioritisation Engine** | ✅ Implemented | Multi-Factor Triage Engine |
| **Alert Lifecycle State Machine** | ✅ Implemented | Live Operational Core |
| **Low-Network / Offline Sync Queue** | ✅ Implemented | Resilient Offline Store |
| **Tamper-Evident Operational Audit Log** | ✅ Implemented | Live Operational Core |
| **Multilingual Dictionary (6 Languages)**| ✅ Implemented | Architectural Internationalization |
| **Future AI/ML API Contract (`/predict`)**| ✅ Implemented | REST / FastAPI Specification |
| **Live IMD Doppler Weather Radar Feed** | ⏳ Future | External API Hook Ready |
| **Live ISRO Sentinel InSAR Satellite Feed**| ⏳ Future | External Sensor Pipeline Ready |
| **Live IoT Geotechnical Tiltmeters** | ⏳ Future | MQTT / InfluxDB Pipeline Ready |
| **Telecom SMS Cell-Broadcast Gateway** | ⏳ Future | CDAC / CAP Gateway Ready |

---

## 9. QR Code & Production Deployment

The project is built as a self-contained single page application (SPA) with an accompanying Node/Express API backend:
- Can be deployed directly to Vercel, Netlify, Railway, or Render.
- Generates a static production bundle in `dist/`.
- Ready to be converted into an official SIH Jury QR Code with HTTPS accessibility.

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview
```

---

*Landslide Guardian 360° — Operationalizing Early Warnings for the North Eastern Region.*  
*Ministry of Development of North Eastern Region (MDoNER) | SIH 2026*
