"""Application configuration.

Centralized settings loaded from environment variables.
"""
import json
from functools import lru_cache
from typing import Any

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_cors(value: Any) -> list[str]:
    """Accept JSON array, comma-separated string, or list."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        v = value.strip()
        if not v:
            return []
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                pass
        return [item.strip().strip('"').strip("'") for item in v.split(",") if item.strip()]
    return list(value)


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---
    APP_NAME: str = "Misr Assistant API"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"
    DEBUG: bool = False

    # --- API ---
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    DATABASE_URL: str = "sqlite+aiosqlite:///./misr_assistant.db"

    # --- CORS ---
    # Stored as raw string from env (JSON or comma-separated).
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173"
    )

    @computed_field  # type: ignore[misc]
    @property
    def cors_origins_list(self) -> list[str]:
        """Parsed CORS origins as a list."""
        return _parse_cors(self.CORS_ORIGINS)

    # --- Auth ---
    SECRET_KEY: str = "change-this-to-a-strong-random-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # --- Google Gemini ---
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.6-flash"
    GEMINI_TIMEOUT: int = 30  # seconds


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()