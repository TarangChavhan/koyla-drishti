import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.scripts.seed import seed_database
from app.db.postgres import SessionLocal

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Ensure database schema and initial seed data are populated."""
    db = SessionLocal()
    try:
        from app.models.user import User
        admin_user = db.query(User).filter(User.email == "admin@coal.gov.in").first()
        if not admin_user:
            seed_database()
    except Exception:
        seed_database()
    finally:
        db.close()
    yield

@pytest.fixture
def client():
    """FastAPI TestClient for automated endpoint verification."""
    with TestClient(app) as test_client:
        yield test_client
