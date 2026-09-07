# KOYLA DRISHTI: AI-Powered Smart Governance & Compliance Intelligence System for Coal Mines

**Production-Oriented FastAPI Backend & Intelligence Platform**  
*Directorate General of Mines Safety (DGMS) & Ministry of Coal Governance Platform*

---

## 1. Overview & Architecture

KOYLA DRISHTI delivers real-time regulatory oversight, AI-powered computer vision compliance verification, and statutory telemetry audit tracking across Indian coal mining complexes.

```
React Frontend (Vite)
       │
       ▼ (REST API + JWT Bearer)
FastAPI Backend Gateway (/api/v1)
       │
       ├── Authentication & RBAC Dependencies
       ├── Deterministic Risk & Statutory Rule Engine
       ├── AIML API Reasoning Layer
       └── Computer Vision & OCR Subsystem
       │
       ├─────────────────────────────────┬──────────────────────────────────┐
       ▼                                 ▼                                  ▼
Neon PostgreSQL                   MongoDB Document Store              Local Media Storage
Authoritative Business State:     Flexible Event Stream:              Uploaded Files:
• Users & RBAC Roles             • Computer Vision Inferences        • Statutory PDF Filings
• Mines & Registries             • PPE & Worker Gear Detections      • CCTV Snapshots
• Inspections & Checklists       • Open-Pit Hazard Events            • Remedial Evidence
• Violations & Corrective Actions• Raw OCR Extracted Tokens
• Statutory Compliance Returns   • Model Execution Telemetry
• Immutable Audit Trails
• Role Notifications
```

---

## 2. Requirements & Prerequisites

- **Python**: 3.10 to 3.14
- **PostgreSQL / NeonDB**: Serverless cloud PostgreSQL or local PostgreSQL 14+
- **MongoDB**: MongoDB Atlas Cluster or local MongoDB instance
- **Node.js**: v18+ (for Frontend React Vite application)

---

## 3. Environment Configuration

1. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Configure environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql+pg8000://user:password@ep-sample-neon.us-east-2.aws.neon.tech/koyla_drishti?ssl=true
   MONGODB_URL=mongodb+srv://user:password@cluster0.mongodb.net/koyla_drishti?retryWrites=true&w=majority
   MONGODB_DB_NAME=koyla_drishti
   JWT_SECRET_KEY=koyla_drishti_super_secure_jwt_secret_key_2026_dgms_gov_in
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   AIML_API_KEY=your_aiml_api_key_here
   AIML_BASE_URL=https://api.aimlapi.com/v1
   AIML_MODEL=gpt-4o-mini
   CORS_ORIGINS=https://koyladrishti.netlify.app,http://localhost:3000,http://localhost:5173
   UPLOAD_DIR=./uploads
   MAX_UPLOAD_SIZE_MB=10
   ADMIN_NAME=Government Administrator
   ADMIN_EMAIL=admin@coal.gov.in
   ADMIN_PASSWORD=GovAdmin@2026
   ENVIRONMENT=development
   ```

> **Zero-Friction Fallback**: If remote NeonDB or MongoDB URLs are not yet specified, the backend automatically initializes an embedded SQLite database and resilient in-memory document store so local development and unit tests run instantly.

---

## 4. Setup & Installation

1. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv .venv
   .venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 5. Database Initialization, SQL Schema & Migrations

### Option A: Direct PostgreSQL SQL Script (NeonDB Console)
Paste `schema.sql` directly into your Neon PostgreSQL SQL editor or run via psql:
```bash
psql $DATABASE_URL -f schema.sql
```

### Option B: Alembic Migrations
Run Alembic upgrade:
```bash
alembic upgrade head
```

---

## 6. Seed Authoritative Initial Data

Execute the seed script to initialize government admins, DGMS inspectors, mine entities, compliance records, violations, and MongoDB alerts:

```bash
python -m app.scripts.seed
```

### Seed Credentials (Demo / Development):
| Role | Email | Password | Scope |
|------|-------|----------|-------|
| **Admin** | `admin@coal.gov.in` | `GovAdmin@2026` | Universal National Governance |
| **Inspector** | `inspector@dgms.gov.in` | `Inspector@2026` | DGMS East Zone / Dhanbad |
| **Mine Authority** | `mine@bccl.gov.in` | `MineBCCL@2026` | Bharat Coking Coal Mine (`KD-104`) |

---

## 7. Machine Learning Subsystem & Datasets

The backend includes a dedicated ML training and inference pipeline under `ml/`:
```
ml/
├── datasets/             # Roboflow Universe PPE & Mining Safety datasets
├── training/
│   ├── train_ppe.py      # Transfer learning fine-tuning with YOLOv8
│   ├── dataset_downloader.py # Dataset setup & annotation configuration
├── inference/
│   ├── ppe_detector.py   # Real-time PPE gear detector (helmet, vest, boots, etc.)
│   ├── hazard_detector.py# Fire, smoke, and pit slope hazard detector
│   └── document_parser.py# Optical Character Recognition for statutory forms
└── evaluation/
    └── benchmark.py      # Computes mAP@50, Precision, Recall, Confusion Matrix
```

### Initialize Datasets & Run Training:
```bash
python -m ml.training.dataset_downloader
python -m ml.training.train_ppe --epochs 30 --batch 16
python -m ml.evaluation.benchmark
```

---

## 8. Run the Backend Application

Launch the FastAPI development server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 9. Run Automated Test Suite

Execute the comprehensive automated test suite verifying auth, RBAC permissions, compliance telemetry, AI alert verification transactions, and dashboard aggregation:

```bash
pytest tests/ -v
```

---

## 10. Connecting to the React Frontend

The React frontend is configured in `Frontend/`:
1. Ensure `Frontend/.env` has:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
2. Start the frontend:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 11. End-to-End Statutory Workflow Lifecycle

```
[1] Mine Authority submits daily shift return
    └── POST /api/v1/compliance/submit
    └── Calculated Score & Risk evaluated deterministically
    └── Raw IoT telemetry stream saved to MongoDB

[2] CCTV Pit Snapshot analyzed by Computer Vision
    └── POST /api/v1/ai/ppe/analyze
    └── YOLOv8 identifies missing helmet/vest
    └── Potential AI Alert generated in MongoDB (ALT-xxxx)
    └── High-priority Notification sent to DGMS Inspector

[3] DGMS Inspector Reviews & Verifies AI Alert
    └── POST /api/v1/ai/alerts/{id}/verify
    └── Single Atomic Transaction:
        • Alert marked Verified in MongoDB
        • Official Statutory Violation created in PostgreSQL
        • Corrective Action directive issued to Mine Authority
        • Notification sent to Mine Authority

[4] Mine Authority Implements Remedy
    └── POST /api/v1/corrective-actions/{id}/submit
    └── Uploads documentary evidence dossier & remediation notes
    └── Status transitions to 'Evidence Attached'
    └── Notification sent to Inspector for adjudication

[5] Inspector Adjudicates Evidence
    └── POST /api/v1/corrective-actions/{id}/adjudicate
    └── Upon Approval:
        • Corrective Action status -> 'Closed'
        • Violation status -> 'Resolved'
        • Mine active violations count decrements
        • Mine compliance score recalculates

[6] Admin Dashboard Dynamically Reflects Update
    └── GET /api/v1/admin/dashboard
    └── Live SQL counts updated without hardcoding
```

---

## 12. Security & Compliance Checklist

- [x] Passwords hashed with bcrypt (no plain passwords stored)
- [x] JWT access tokens with short-lived claims and standard headers
- [x] Object-level authorization: Mine Authority cannot access or modify unauthorized mines
- [x] Inspectors cannot perform administrative user management
- [x] AI predictions do NOT create official violations without human inspector verification
- [x] Immutable audit trail recorded for all state mutations
- [x] File uploads sanitized with extension whitelisting and size limits
- [x] AIML API key strictly confined to backend (never exposed to React client)
