from pydantic import BaseModel


class InputMessage(BaseModel):
    recipient: str
    text: str


class MessageDisplayingModel(BaseModel):
    text: str
    key: str | None = None
    sender: str
    created: int
    is_last: bool
    recipient: str


class MessageInDB(MessageDisplayingModel):
    object: str
