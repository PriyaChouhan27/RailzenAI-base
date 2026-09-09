"""Environment-backed configuration for the foundation API."""

from dataclasses import dataclass
import os


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    database_path: str = os.getenv("RAILZEN_DATABASE_PATH", "backend/data/railzen.db")
    cors_origins: list[str] = None  # type: ignore[assignment]

    def __post_init__(self) -> None:
        if self.cors_origins is None:
            object.__setattr__(
                self,
                "cors_origins",
                _csv(os.getenv("RAILZEN_CORS_ORIGINS", "*")) or ["*"],
            )


settings = Settings()