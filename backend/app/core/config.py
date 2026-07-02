"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    PROJECT_NAME: str = "AIROS"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = (
        "AI Research Operating System — "
        "A production-grade platform for scientific literature analysis."
    )
    API_PREFIX: str = "/api/v1"

    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    CHROMADB_PATH: str = "./data/chromadb"
    JWT_SECRET: str = ""

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    DEBUG: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
