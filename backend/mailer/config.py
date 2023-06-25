from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    EMAIL_SENDER: EmailStr
    PASSWORD: str

    class Config:
        env_file = ".env"


settings = Settings()
