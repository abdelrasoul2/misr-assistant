"""Application configuration.

Centralized settings loaded from environment variables.
"""
import json
from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


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
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        """Accept JSON array, comma-separated string, or list."""
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            # JSON array
            if v.startswith("["):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            # comma-separated
            return [item.strip().strip('"').strip("'") for item in v.split(",") if item.strip()]
        return v

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