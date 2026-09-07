import pytest
from fastapi.testclient import TestClient

def get_tokens(client: TestClient):
    # 1. Admin token
    admin_res = client.post("/api/v1/auth/login", json={"email": "admin@coal.gov.in", "password": "GovAdmin@2026"})
    admin_token = admin_res.json()["data"]["access_token"]

    # 2. Inspector token
    insp_res = client.post("/api/v1/auth/login", json={"email": "inspector@dgms.gov.in", "password": "Inspector@2026"})
    insp_token = insp_res.json()["data"]["access_token"]

    # 3. Mine Authority token (KD-104)
    mine_res = client.post("/api/v1/auth/login", json={"email": "mine@bccl.gov.in", "password": "MineBCCL@2026"})
    mine_token = mine_res.json()["data"]["access_token"]

    return admin_token, insp_token, mine_token

def test_mine_authority_cannot_access_other_mine(client: TestClient):
    """Critical security test: Mine Authority of KD-104 must NOT access Mine KD-118."""
    _, _, mine_token = get_tokens(client)

    # Access authorized mine KD-104
    ok_res = client.get("/api/v1/mines/KD-104", headers={"Authorization": f"Bearer {mine_token}"})
    assert ok_res.status_code == 200

    # Attempt to access unauthorized mine KD-118
    forbidden_res = client.get("/api/v1/mines/KD-118", headers={"Authorization": f"Bearer {mine_token}"})
    assert forbidden_res.status_code == 403
    assert forbidden_res.json()["error_code"] == "FORBIDDEN"

def test_mine_authority_cannot_verify_ai_alert(client: TestClient):
    """Mine Authority cannot verify an AI alert (only DGMS Inspectors can)."""
    _, _, mine_token = get_tokens(client)

    verify_res = client.post(
        "/api/v1/ai/alerts/ALT-9021/verify",
        json={"officer_note": "Attempted self verification"},
        headers={"Authorization": f"Bearer {mine_token}"}
    )
    assert verify_res.status_code == 403
    assert verify_res.json()["error_code"] == "FORBIDDEN"

def test_inspector_cannot_create_users(client: TestClient):
    """Inspector cannot perform Admin-only user management."""
    _, insp_token, _ = get_tokens(client)

    create_user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Unauthorized User",
            "email": "unauth@dgms.gov.in",
            "role": "inspector",
            "designation": "Staff"
        },
        headers={"Authorization": f"Bearer {insp_token}"}
    )
    assert create_user_res.status_code == 403
    assert create_user_res.json()["error_code"] == "FORBIDDEN"

def test_admin_can_access_all_mines(client: TestClient):
    """Admin has universal governance visibility."""
    admin_token, _, _ = get_tokens(client)

    res1 = client.get("/api/v1/mines/KD-104", headers={"Authorization": f"Bearer {admin_token}"})
    assert res1.status_code == 200

    res2 = client.get("/api/v1/mines/KD-118", headers={"Authorization": f"Bearer {admin_token}"})
    assert res2.status_code == 200
