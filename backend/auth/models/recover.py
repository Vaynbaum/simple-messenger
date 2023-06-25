from pydantic import BaseModel


class RecoverDataModel(BaseModel):
    key: str | None = None
    code: str
    user_key: str
