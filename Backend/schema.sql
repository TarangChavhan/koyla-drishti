-- ====================================================================
-- KOYLA DRISHTI: AI-Powered Smart Governance & Compliance Intelligence
-- Authoritative Relational Database Schema for PostgreSQL / NeonDB
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean existing tables if resetting (commented out for safety)
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS reports CASCADE;
-- DROP TABLE IF EXISTS documents CASCADE;
-- DROP TABLE IF EXISTS corrective_actions CASCADE;
-- DROP TABLE IF EXISTS violations CASCADE;
-- DROP TABLE IF EXISTS inspections CASCADE;
-- DROP TABLE IF EXISTS compliance_records CASCADE;
-- DROP TABLE IF EXISTS mines CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'INSPECTOR', 'MINE_AUTHORITY')),
    designation VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    department VARCHAR(255),
    avatar_text VARCHAR(10),
    phone VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    mine_id VARCHAR(50),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_mine_id ON users(mine_id);

-- 2. MINES TABLE
CREATE TABLE IF NOT EXISTS mines (
    id VARCHAR(50) PRIMARY KEY, -- e.g. KD-104
    name VARCHAR(255) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    mine_type VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    compliance_score NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'Compliant' CHECK (status IN ('Compliant', 'Under Review', 'Non-Compliant')),
    last_inspection VARCHAR(50),
    next_inspection VARCHAR(50),
    address TEXT,
    contact_officer VARCHAR(255),
    contact_email VARCHAR(255),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    active_violations_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mines_status ON mines(status);
CREATE INDEX IF NOT EXISTS idx_mines_risk_level ON mines(risk_level);
CREATE INDEX IF NOT EXISTS idx_mines_state_district ON mines(state, district);

-- Add foreign key from users.mine_id to mines.id if applicable
ALTER TABLE users 
    DROP CONSTRAINT IF EXISTS fk_users_mine;
ALTER TABLE users 
    ADD CONSTRAINT fk_users_mine 
    FOREIGN KEY (mine_id) REFERENCES mines(id) ON DELETE SET NULL;

-- 3. COMPLIANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS compliance_records (
    id VARCHAR(50) PRIMARY KEY,
    mine_id VARCHAR(50) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    reporting_period VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Daily Telemetry & Environmental',
    production_tonnage VARCHAR(100),
    pm10_level NUMERIC(8, 2) DEFAULT 0.0,
    ambient_noise_db NUMERIC(8, 2) DEFAULT 0.0,
    methane_concentration NUMERIC(8, 3) DEFAULT 0.0,
    blast_vibration_mms NUMERIC(8, 2) DEFAULT 0.0,
    water_discharge_ph NUMERIC(5, 2) DEFAULT 7.0,
    safety_incident_reported BOOLEAN DEFAULT FALSE,
    notes TEXT,
    attachment_filename VARCHAR(255),
    calculated_score NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'Compliant',
    ai_analysis_summary TEXT,
    raw_telemetry_id VARCHAR(100), -- MongoDB reference
    submitted_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_compliance_mine_id ON compliance_records(mine_id);
CREATE INDEX IF NOT EXISTS idx_compliance_created_at ON compliance_records(created_at DESC);

-- 4. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(50) PRIMARY KEY, -- e.g. INS-2401
    mine_id VARCHAR(50) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    mine_name VARCHAR(255) NOT NULL,
    inspector_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    inspector_name VARCHAR(255) NOT NULL,
    inspection_type VARCHAR(50) NOT NULL CHECK (inspection_type IN ('Safety', 'Environment', 'Full Audit', 'Follow-up', 'Equipment')),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Submitted', 'Under Review', 'Completed', 'Cancelled')),
    priority VARCHAR(50) NOT NULL DEFAULT 'Routine' CHECK (priority IN ('Routine', 'Priority', 'Urgent')),
    purpose TEXT NOT NULL,
    checklist_items JSONB DEFAULT '[]'::jsonb,
    observations TEXT,
    recommendations TEXT,
    evidence_files_count INTEGER NOT NULL DEFAULT 0,
    mongo_report_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inspections_mine_id ON inspections(mine_id);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_id ON inspections(inspector_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);

-- 5. VIOLATIONS TABLE
CREATE TABLE IF NOT EXISTS violations (
    id VARCHAR(50) PRIMARY KEY, -- e.g. VIO-1024
    mine_id VARCHAR(50) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    mine_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    description TEXT NOT NULL,
    issued_date VARCHAR(50) NOT NULL,
    deadline VARCHAR(50) NOT NULL,
    assigned_inspector VARCHAR(255) NOT NULL,
    assigned_inspector_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Corrective Action Required', 'Evidence Submitted', 'Verified', 'Resolved', 'Rejected')),
    corrective_action_text TEXT,
    submitted_evidence JSONB DEFAULT '[]'::jsonb,
    mine_response TEXT,
    alert_id VARCHAR(100), -- MongoDB AI alert reference
    inspection_id VARCHAR(50) REFERENCES inspections(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_violations_mine_id ON violations(mine_id);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON violations(severity);

-- 6. CORRECTIVE ACTIONS TABLE
CREATE TABLE IF NOT EXISTS corrective_actions (
    id VARCHAR(50) PRIMARY KEY, -- e.g. ACT-501
    violation_id VARCHAR(50) NOT NULL REFERENCES violations(id) ON DELETE CASCADE,
    mine_id VARCHAR(50) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    mine_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    due_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Response' CHECK (status IN ('Pending Response', 'Evidence Attached', 'Under Review', 'Approved', 'Rejected', 'Closed')),
    response_note TEXT,
    submitted_evidence_files JSONB DEFAULT '[]'::jsonb,
    inspector_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_corrective_actions_violation_id ON corrective_actions(violation_id);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_mine_id ON corrective_actions(mine_id);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_status ON corrective_actions(status);

-- 7. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY, -- e.g. DOC-101
    mine_id VARCHAR(50) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    mine_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Safety', 'Environment', 'Equipment', 'Compliance', 'Operations')),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'csv')),
    upload_date VARCHAR(50) NOT NULL,
    expiry_date VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'Verified' CHECK (status IN ('Verified', 'Review', 'Rejected', 'Pending')),
    url TEXT,
    ocr_extracted_data JSONB,
    mongo_raw_ocr_ref VARCHAR(100),
    uploaded_by VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_mine_id ON documents(mine_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    timestamp VARCHAR(100) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    role_target VARCHAR(50) NOT NULL CHECK (role_target IN ('admin', 'inspector', 'mine', 'all')),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    link_to_module VARCHAR(255),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_role_target ON notifications(role_target);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 10. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('Compliance', 'Inspection', 'Violation', 'Risk', 'Mine Summary')),
    generated_date VARCHAR(100) NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Processing', 'Approved')),
    file_format VARCHAR(20) NOT NULL CHECK (file_format IN ('PDF', 'XLSX')),
    download_url TEXT,
    report_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
