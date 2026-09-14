"""Google Gemini API client (REST-based, no SDK)."""
import json
from typing import Any

import httpx

from app.core.config import settings

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"


class GeminiError(Exception):
    """Raised when Gemini API call fails."""


class GeminiClient:
    """Simple async client for Google Gemini API."""

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        timeout: int | None = None,
    ) -> None:
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.timeout = timeout or settings.GEMINI_TIMEOUT

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def generate(
        self,
        prompt: str,
        *,
        system_instruction: str | None = None,
        temperature: float = 0.3,
        max_output_tokens: int = 1024,
        json_mode: bool = False,
    ) -> str:
        """Generate text from a prompt."""
        if not self.is_configured:
            raise GeminiError("GEMINI_API_KEY is not configured")

        url = (
            f"{GEMINI_API_BASE}/models/{self.model}:generateContent"
            f"?key={self.api_key}"
        )

        body: dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_output_tokens,
            },
        }

        if system_instruction:
            body["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        if json_mode:
            body["generationConfig"]["responseMimeType"] = "application/json"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=body)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPStatusError as exc:
            raise GeminiError(
                f"Gemini API returned {exc.response.status_code}: "
                f"{exc.response.text[:200]}"
            ) from exc
        except httpx.HTTPError as exc:
            raise GeminiError(f"Gemini API request failed: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise GeminiError(f"Invalid JSON from Gemini: {exc}") from exc

        try:
            candidates = data.get("candidates", [])
            if not candidates:
                raise GeminiError("Gemini returned no candidates")
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                raise GeminiError("Gemini returned no content parts")
            return parts[0].get("text", "").strip()
        except (KeyError, IndexError) as exc:
            raise GeminiError(f"Unexpected Gemini response shape: {exc}") from exc


gemini = GeminiClient()