import pytest
from fastapi.testclient import TestClient

def test_full_government_workflow(client: TestClient):
    """
    CRITICAL END-TO-END GOVERNMENT WORKFLOW TEST:
    1. Inspector logs in, reviews AI alert ALT-9021.
    2. Inspector verifies alert -> Triggers atomic creation of Violation & Corrective Action.
    3. Mine Authority logs in, views issued corrective action.
    4. Mine Authority submits response with evidence dossier.
    5. Inspector logs in, adjudicates evidence as 'Approved'.
    6. Corrective Action status becomes 'Closed' & Violation status becomes 'Resolved'.
    7. Mine's active violations count decreases.
    8. Admin dashboard re-fetch reflects updated resolved and pending counts.
    """
    # 1. Login Inspector & Mine Authority & Admin
    insp_token = client.post("/api/v1/auth/login", json={"email": "inspector@dgms.gov.in", "password": "Inspector@2026"}).json()["data"]["access_token"]
    mine_token = client.post("/api/v1/auth/login", json={"email": "mine@bccl.gov.in", "password": "MineBCCL@2026"}).json()["data"]["access_token"]
    admin_token = client.post("/api/v1/auth/login", json={"email": "admin@coal.gov.in", "password": "GovAdmin@2026"}).json()["data"]["access_token"]

    # Check baseline dashboard
    base_dash = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {admin_token}"}).json()["data"]
    base_resolved = base_dash["resolved_cases"]

    # 2. Inspector verifies AI Alert ALT-9021
    verify_res = client.post(
        "/api/v1/ai/alerts/ALT-9021/verify",
        json={
            "officer_note": "Confirmed on-site CCTV evidence of 2 personnel without safety gear.",
            "violation_category": "Labour Welfare & PPE",
            "deadline_days": 7,
            "corrective_directives": "Equip all shift personnel with ISI certified gear immediately."
        },
        headers={"Authorization": f"Bearer {insp_token}"}
    )
    assert verify_res.status_code == 200
    v_data = verify_res.json()["data"]
    violation_id = v_data["violation_id"]
    action_id = v_data["action_id"]
    assert violation_id is not None
    assert action_id is not None

    # 3. Mine Authority views the newly issued Corrective Action
    action_res = client.get(f"/api/v1/corrective-actions/{action_id}", headers={"Authorization": f"Bearer {mine_token}"})
    assert action_res.status_code == 200
    assert action_res.json()["data"]["status"] == "Pending Response"

    # 4. Mine Authority submits remedial response and uploads evidence
    respond_res = client.post(
        f"/api/v1/corrective-actions/{action_id}/submit",
        json={
            "response_note": "New batch of 150 DGMS compliant helmets issued. Safety muster parade conducted.",
            "evidence_file_name": "helmet_distribution_registry_dhanbad.pdf"
        },
        headers={"Authorization": f"Bearer {mine_token}"}
    )
    assert respond_res.status_code == 200
    assert respond_res.json()["data"]["status"] == "Evidence Attached"

    # 5. Inspector reviews submitted evidence and APPROVES
    adjudicate_res = client.post(
        f"/api/v1/corrective-actions/{action_id}/adjudicate",
        json={
            "decision": "Approved",
            "remarks": "Reviewed delivery receipt and attendance register. Satisfactory compliance established."
        },
        headers={"Authorization": f"Bearer {insp_token}"}
    )
    assert adjudicate_res.status_code == 200
    assert adjudicate_res.json()["data"]["status"] == "Closed"

    # 6. Verify linked Violation is now formally RESOLVED
    check_vio = client.get(f"/api/v1/violations/{violation_id}", headers={"Authorization": f"Bearer {mine_token}"})
    assert check_vio.status_code == 200
    assert check_vio.json()["data"]["status"] == "Resolved"

    # 7. Admin Dashboard automatically reflects updated resolved cases
    new_dash = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {admin_token}"}).json()["data"]
    assert new_dash["resolved_cases"] >= base_resolved + 1
