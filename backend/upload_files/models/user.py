from typing import List
from pydantic import BaseModel, EmailStr


class UserModelInDB(BaseModel):
    fullname: str | None
    email: EmailStr | None
    img: str | None = None
    key: str
    interlocutors: List[str] = []
    password: str | None
    object: str
    double_key: str
