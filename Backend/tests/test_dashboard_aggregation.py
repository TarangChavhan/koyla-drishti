import pytest
from fastapi.testclient import TestClient

def test_admin_dashboard_dynamic_calculation(client: TestClient):
    """Ensure dashboard KPIs are calculated directly from live database tables."""
    admin_token = client.post("/api/v1/auth/login", json={"email": "admin@coal.gov.in", "password": "GovAdmin@2026"}).json()["data"]["access_token"]

    dash_res = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {admin_token}"})
    assert dash_res.status_code == 200
    data = dash_res.json()["data"]

    assert "total_mines" in data
    assert data["total_mines"] >= 5
    assert "compliant_mines" in data
    assert "compliance_rate" in data
    assert "pending_violations" in data
    assert "resolved_cases" in data
    assert "high_risk_mines" in data
    assert "pending_inspections" in data
    assert "compliance_categories" in data
    assert len(data["compliance_categories"]) == 5

def test_inspector_and_mine_dashboards(client: TestClient):
    """Verify role-scoped dashboards for Inspector and Mine Authority."""
    insp_token = client.post("/api/v1/auth/login", json={"email": "inspector@dgms.gov.in", "password": "Inspector@2026"}).json()["data"]["access_token"]
    mine_token = client.post("/api/v1/auth/login", json={"email": "mine@bccl.gov.in", "password": "MineBCCL@2026"}).json()["data"]["access_token"]

    # Inspector dashboard
    insp_dash = client.get("/api/v1/inspector/dashboard", headers={"Authorization": f"Bearer {insp_token}"})
    assert insp_dash.status_code == 200
    assert "assigned_mines_count" in insp_dash.json()["data"]

    # Mine dashboard
    mine_dash = client.get("/api/v1/mine/dashboard", headers={"Authorization": f"Bearer {mine_token}"})
    assert mine_dash.status_code == 200
    assert mine_dash.json()["data"]["mine_id"] == "KD-104"
    assert "overall_compliance" in mine_dash.json()["data"]
