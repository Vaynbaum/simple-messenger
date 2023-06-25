from typing import List
from pydantic import BaseModel, EmailStr


class UserDisplayingModel(BaseModel):
    fullname: str | None
    email: EmailStr | None
    img: str | None = None
    key: str


class ProfileDisplayingModel(UserDisplayingModel):
    interlocutors: List[str] = []


class UserModelInDB(ProfileDisplayingModel):
    password: str | None
    object: str
    double_key: str
