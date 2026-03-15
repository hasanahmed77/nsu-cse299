from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Load .env relative to backend root regardless of current working directory.
    _env_path = Path(__file__).resolve().parents[2] / ".env"
    model_config = SettingsConfigDict(env_file=str(_env_path), extra="ignore")

    api_v1_prefix: str = "/api/v1"
    project_name: str = "Netflix Clone API"

    # Security
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60 * 24 * 7

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/netflix"
    database_pool_url: str | None = None

    # CORS
    cors_origins: str = "http://localhost:3000"


settings = Settings()
