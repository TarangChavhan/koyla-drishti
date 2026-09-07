import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.database import Base

logger = logging.getLogger("koyla_drishti.db.postgres")

def get_engine():
    db_url = settings.DATABASE_URL.strip()
    # Normalize postgres:// to postgresql://
    if db_url.startswith("postgres://"):
        db_url = "postgresql://" + db_url[len("postgres://"):]
    
    # If standard postgresql:// on Windows without binary psycopg2, allow pg8000
    if db_url.startswith("postgresql://") and not ("+" in db_url.split("://")[0]):
        try:
            import psycopg2
        except ImportError:
            # Switch to pg8000 pure python driver if psycopg2 is missing
            db_url = "postgresql+pg8000://" + db_url[len("postgresql://"):]

    engine_args = {}
    if db_url.startswith("sqlite"):
        engine_args["connect_args"] = {"check_same_thread": False}
    else:
        engine_args["pool_pre_ping"] = True
        engine_args["pool_recycle"] = 300
        engine_args["pool_size"] = 10
        engine_args["max_overflow"] = 20
        if "pg8000" in db_url:
            # Clean url query params for pg8000 and pass ssl_context in connect_args
            if "?" in db_url:
                base_url = db_url.split("?")[0]
                db_url = base_url
            engine_args["connect_args"] = {"ssl_context": True}

    try:
        engine = create_engine(db_url, **engine_args)
        # Test connection
        with engine.connect() as conn:
            logger.info(f"Connected to relational database: {engine.name}")
        return engine
    except Exception as e:
        logger.warning(f"Failed to connect to primary database ({db_url}): {e}. Falling back to SQLite local storage.")
        fallback_engine = create_engine("sqlite:///./koyla_drishti.db", connect_args={"check_same_thread": False})
        return fallback_engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_postgres_db():
    """Create all tables in the database if they do not exist."""
    # Import all models to ensure they are registered with Base.metadata
    import app.models  # noqa
    Base.metadata.create_all(bind=engine)
    logger.info("Authoritative PostgreSQL schema tables verified/created.")
