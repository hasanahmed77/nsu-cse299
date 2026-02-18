from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    api_v1_prefix: str = "/api/v1"
    project_name: str = "Netflix Clone API"

    # Security
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60 * 24 * 7

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/netflix"

    # CORS
    cors_origins: str = "http://localhost:3000"


settings = Settings()
