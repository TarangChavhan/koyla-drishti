import pytest
from fastapi.testclient import TestClient

def test_login_success(client: TestClient):
    """Verify login generates JWT token and user info."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@coal.gov.in", "password": "GovAdmin@2026"}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "access_token" in json_data["data"]
    assert json_data["data"]["user"]["email"] == "admin@coal.gov.in"
    assert json_data["data"]["user"]["role"] == "admin"

def test_login_invalid_password(client: TestClient):
    """Verify login with incorrect password returns 401."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@coal.gov.in", "password": "WrongPassword!999"}
    )
    assert response.status_code == 401
    assert response.json()["success"] is False
    assert response.json()["error_code"] == "UNAUTHORIZED"

def test_login_nonexistent_user(client: TestClient):
    """Verify login with unknown email fails with 401."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ghost@nonexistent.gov.in", "password": "SomePassword123"}
    )
    assert response.status_code == 401

def test_get_me_authenticated(client: TestClient):
    """Verify /auth/me returns authenticated officer details."""
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "inspector@dgms.gov.in", "password": "Inspector@2026"}
    )
    token = login_res.json()["data"]["access_token"]

    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_res.status_code == 200
    assert me_res.json()["data"]["role"] == "inspector"
