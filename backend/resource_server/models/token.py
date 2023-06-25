from pydantic import BaseModel


class Tokens(BaseModel):
    access_token: str
    token_type:str
    refresh_token: str
