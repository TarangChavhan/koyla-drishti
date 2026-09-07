import logging
from app.db.postgres import init_postgres_db
from app.db.mongo import mongo_db

logger = logging.getLogger("koyla_drishti.db.session")

def init_databases():
    """Initialize relational and document database connections on application startup."""
    logger.info("Initializing relational database schema...")
    try:
        init_postgres_db()
    except Exception as e:
        logger.error(f"Error initializing PostgreSQL schema: {e}")
    
    logger.info("Connecting to document database (MongoDB)...")
    try:
        mongo_db.connect()
    except Exception as e:
        logger.warning(f"Error initializing MongoDB: {e}")
