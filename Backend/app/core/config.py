import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "KOYLA DRISHTI Central Governance Platform"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_V1_STR: str = "/api/v1"

    # PostgreSQL / NeonDB Database Configuration
    DATABASE_URL: str = Field(
        default="sqlite:///./koyla_drishti.db",
        description="Neon PostgreSQL or local SQLite fallback connection string"
    )

    # MongoDB Configuration for Unstructured AI & Event Data
    MONGODB_URL: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB Atlas or local connection string"
    )
    MONGODB_DB_NAME: str = "koyla_drishti"

    # JWT Authentication & Security
    JWT_SECRET_KEY: str = Field(
        default="koyla_drishti_super_secure_jwt_secret_key_2026_dgms_gov_in",
        description="Secret key for JWT generation"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AIML API Integration
    AIML_API_KEY: str = Field(default="", description="AIML API Key for compliance reasoning")
    AIML_BASE_URL: str = "https://api.aimlapi.com/v1"
    AIML_MODEL: str = "gpt-4o-mini"

    # CORS Configuration
    CORS_ORIGINS: str = "https://koyladrishti.netlify.app,http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # File Storage
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    MAX_UPLOAD_SIZE_MB: int = 10

    # Default Seed Admin Configuration
    ADMIN_NAME: str = "Government Administrator"
    ADMIN_EMAIL: str = "admin@coal.gov.in"
    ADMIN_PASSWORD: str = "GovAdmin@2026"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
