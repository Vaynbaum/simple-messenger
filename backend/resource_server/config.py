from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    DETA_PROJECT_KEY: str
    DETA_NAME_BASE: str
    SECRET_STRING: str
    ALGORITHM: str
    CORS_URL: List[str]

    class Config:
        env_file = ".env"


settings = Settings()
