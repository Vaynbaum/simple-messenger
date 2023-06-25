from typing import List
from pydantic import BaseModel, EmailStr


class SigninModel(BaseModel):
    username: str
    password: str


class SignupModel(BaseModel):
    password: str
    fullname: str
    email: EmailStr


class UserModelInDB(BaseModel):
    fullname: str
    email: EmailStr
    key: str | None = None
    password: str
    object:str
    img: str | None = None
    double_key: str|None = None
    interlocutors: List[str] = []