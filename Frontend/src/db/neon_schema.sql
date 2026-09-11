-- ==========================================================
-- KOYLA DRISHTI: Neon PostgreSQL Authoritative Schema
-- Module: CCTV & AI Video Safety Surveillance
-- Designed for Neon Serverless PostgreSQL
-- ==========================================================

-- 1. CAMERAS
CREATE TABLE IF NOT EXISTS cameras (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. CAM-SECL-GEV-01
    name VARCHAR(255) NOT NULL,                  -- e.g. Pit-4 Highwall & Shovel Zone
    mine_id VARCHAR(50) NOT NULL,                -- Foreign key to mines table
    mine_name VARCHAR(255) NOT NULL,
    company VARCHAR(50) NOT NULL,                -- e.g. SECL, BCCL, ECL, NCL
    zone VARCHAR(100) NOT NULL,                  -- e.g. Excavation Pit, Conveyor Corridor
    camera_status VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- ONLINE, OFFLINE, DEGRADED
    ai_monitoring_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, FAILED
    resolution VARCHAR(50) NOT NULL DEFAULT '1920x1080 @ 30 FPS',
    stream_url_masked VARCHAR(255) NOT NULL,
    rtsp_ip VARCHAR(50) NOT NULL,
    assigned_inspector_id VARCHAR(50),
    assigned_inspector_name VARCHAR(100),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    ptz_supported BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cameras_mine_id ON cameras(mine_id);
CREATE INDEX IF NOT EXISTS idx_cameras_status ON cameras(camera_status);
CREATE INDEX IF NOT EXISTS idx_cameras_ai_status ON cameras(ai_monitoring_status);

-- 2. SAFETY RULES
CREATE TABLE IF NOT EXISTS safety_rules (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. RULE-PPE-NO-HELMET
    name VARCHAR(255) NOT NULL,
    description TEXT,
    detection_classes JSONB NOT NULL,            -- Array of classes e.g. ["worker", "no_helmet"]
    required_zone VARCHAR(100),                  -- Zone where rule applies
    min_confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.75,
    persistence_frames INTEGER NOT NULL DEFAULT 3, -- Must persist N frames
    cooldown_seconds INTEGER NOT NULL DEFAULT 120, -- Cooldown between events
    severity VARCHAR(20) NOT NULL DEFAULT 'High', -- Low, Medium, High, Critical
    triggers_buzzer BOOLEAN NOT NULL DEFAULT TRUE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CCTV EVENTS
CREATE TABLE IF NOT EXISTS cctv_events (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. EVT-CCTV-2026-0911-001
    mine_id VARCHAR(50) NOT NULL,
    mine_name VARCHAR(255) NOT NULL,
    camera_id VARCHAR(50) NOT NULL REFERENCES cameras(id),
    camera_name VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    detection_type VARCHAR(100) NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL,
    severity VARCHAR(20) NOT NULL,               -- Low, Medium, High, Critical
    rule_id VARCHAR(50) REFERENCES safety_rules(id),
    rule_name VARCHAR(255) NOT NULL,
    evidence_frame_url TEXT,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED' -- PROCESSED, WARNING_TRIGGERED, SUPPRESSED_DUPLICATE
);

CREATE INDEX IF NOT EXISTS idx_cctv_events_camera_id ON cctv_events(camera_id);
CREATE INDEX IF NOT EXISTS idx_cctv_events_timestamp ON cctv_events(event_timestamp);

-- 4. SAFETY EVENTS & WARNINGS (120 SECONDS AUTHORITATIVE ENGINE)
CREATE TABLE IF NOT EXISTS safety_events (
    warning_id VARCHAR(50) PRIMARY KEY,          -- e.g. WRN-CCTV-8821
    event_id VARCHAR(50) NOT NULL REFERENCES cctv_events(id),
    mine_id VARCHAR(50) NOT NULL,
    mine_name VARCHAR(255) NOT NULL,
    camera_id VARCHAR(50) NOT NULL REFERENCES cameras(id),
    camera_name VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    detection_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,               -- High, Critical
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Authoritative start
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,   -- Exactly start_time + 120s
    duration_seconds INTEGER NOT NULL DEFAULT 120,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED, FAILED
    buzzer_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_safety_events_status ON safety_events(status);
CREATE INDEX IF NOT EXISTS idx_safety_events_end_time ON safety_events(end_time);

-- 5. BUZZER EVENTS
CREATE TABLE IF NOT EXISTS buzzer_events (
    id VARCHAR(50) PRIMARY KEY,
    warning_id VARCHAR(50) NOT NULL REFERENCES safety_events(warning_id),
    camera_id VARCHAR(50) NOT NULL REFERENCES cameras(id),
    mine_id VARCHAR(50) NOT NULL,
    buzzer_state VARCHAR(20) NOT NULL,           -- BUZZER ACTIVE, BUZZER INACTIVE
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    stopped_at TIMESTAMP WITH TIME ZONE,
    stopped_reason VARCHAR(100)                  -- TIMER_EXPIRED, INSPECTOR_CANCELLED, REJECTED
);

-- 6. CCTV AI ALERTS (INSPECTOR VERIFICATION WORKFLOW)
CREATE TABLE IF NOT EXISTS cctv_alerts (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g. ALT-CCTV-901
    event_id VARCHAR(50) NOT NULL REFERENCES cctv_events(id),
    warning_id VARCHAR(50) REFERENCES safety_events(warning_id),
    mine_id VARCHAR(50) NOT NULL,
    mine_name VARCHAR(255) NOT NULL,
    camera_id VARCHAR(50) NOT NULL REFERENCES cameras(id),
    camera_name VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    detection VARCHAR(255) NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,             -- High, Critical, Medium
    date_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    evidence_payload JSONB NOT NULL,             -- Frame URL, bounding boxes, metadata
    buzzer_status VARCHAR(20) NOT NULL DEFAULT 'BUZZER ACTIVE',
    alert_status VARCHAR(20) NOT NULL DEFAULT 'DETECTED', -- DETECTED, UNDER_REVIEW, VERIFIED, REJECTED
    verified_by VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    violation_id VARCHAR(50),                    -- Linked official violation created upon verification
    corrective_action_id VARCHAR(50),
    investigation_notes JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_cctv_alerts_status ON cctv_alerts(alert_status);
CREATE INDEX IF NOT EXISTS idx_cctv_alerts_mine ON cctv_alerts(mine_id);

-- 7. AUDIT LOGS (IMMUTABLE STATUTORY RECORD)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,                 -- CCTV_EVENT_CREATED, AI_ALERT_CREATED, WARNING_ACTIVATED, etc.
    event_or_alert_id VARCHAR(50) NOT NULL,
    result VARCHAR(50) NOT NULL,                 -- SUCCESS, FAILED, VERIFIED, REJECTED
    details JSONB,
    ip_address VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(action_timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
