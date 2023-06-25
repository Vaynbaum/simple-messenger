from pydantic import BaseModel

from models.message import MessageDisplayingModel
from models.user import UserDisplayingModel


class DialogModel(BaseModel):
    interlocutor: UserDisplayingModel
    message: MessageDisplayingModel
