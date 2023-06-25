from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    DETA_PROJECT_KEY: str
    DETA_NAME_BASE: str
    SECRET_STRING: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    URL_MAILER: str
    URL_NEW_PASSWORD: str
    DETA_NAME_BASE_RECOVER_PASSWORD: str
    CORS_URL: List[str]

    class Config:
        env_file = ".env"


settings = Settings()
