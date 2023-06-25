from pydantic import BaseModel


class MessageModel(BaseModel):
    mailer_result: str
