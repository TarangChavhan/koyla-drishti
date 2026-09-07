import pytest
from fastapi.testclient import TestClient

def test_telemetry_submission_workflow(client: TestClient):
    """Verify statutory return submission, deterministic scoring, and database persistence."""
    mine_res = client.post("/api/v1/auth/login", json={"email": "mine@bccl.gov.in", "password": "MineBCCL@2026"})
    token = mine_res.json()["data"]["access_token"]

    payload = {
        "mine_id": "KD-104",
        "production_tonnage": "15,800",
        "pm10_level": 74.5,
        "ambient_noise_db": 78.0,
        "methane_concentration": 0.12,
        "blast_vibration_mms": 3.1,
        "water_discharge_ph": 7.3,
        "safety_incident_reported": False,
        "notes": "Normal operations in pit face 3."
    }

    sub_res = client.post(
        "/api/v1/compliance/submit",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert sub_res.status_code == 200
    data = sub_res.json()["data"]
    assert "calculated_score" in data
    assert data["calculated_score"] > 80.0
    assert data["risk_level"] in ["Low", "Medium"]
    assert "ai_analysis_summary" in data

    # Verify breakdown API reflects updated state
    breakdown_res = client.get(
        "/api/v1/compliance/KD-104",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert breakdown_res.status_code == 200
    assert len(breakdown_res.json()["data"]["categories"]) > 0
