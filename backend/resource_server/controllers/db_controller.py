from deta import Deta
from common.consts import NAME_OBJECT_USER
from common.phrases import (
    PUT_MESSAGE_FAILED,
    PUT_USER_DATA_FAILED,
    UPDATE_MESSAGE_DATA_FAILED,
    UPDATE_USER_DATA_FAILED,
)
from config import settings
from exceptions.db_exception import DBException
from models.message import MessageDisplayingModel, MessageInDB
from models.user import UserDisplayingModel, UserModelInDB


class DatabaseController:
    def __init__(self):
        deta = Deta(settings.DETA_PROJECT_KEY)
        self.__db = deta.Base(settings.DETA_NAME_BASE)

    def get_user_by_key(self, key: str):
        user = self.__db.get(key)
        return UserModelInDB(**user) if user else None

    def get_all_users(self, limit: int | None = None, last: str | None = None):
        users = self.__db.fetch({"object": NAME_OBJECT_USER}, limit=limit, last=last)
        return [UserDisplayingModel(**user) for user in users.items], users.last

    def get_interlocutors_by_key(self, keys):
        data = [{"double_key": key} for key in keys]
        if data:
            users = self.__db.fetch(data)
            return [UserDisplayingModel(**user) for user in users.items]
        else:
            return []

    def append_interlocutor(self, interlocutor_key: str, key: str):
        try:
            self.__db.update(
                {"interlocutors": self.__db.util.append(interlocutor_key)}, key
            )
            return True
        except Exception:
            raise DBException(UPDATE_USER_DATA_FAILED)

    def put_user(self, user: UserModelInDB):
        try:
            return UserModelInDB(**self.__db.put(user.dict()))
        except Exception:
            raise DBException(PUT_USER_DATA_FAILED)

    def update_user(self, data, key: str):
        try:
            self.__db.update(data, key)
            return True
        except Exception:
            raise DBException(PUT_USER_DATA_FAILED)

    def update_message(self, data, key: str):
        try:
            self.__db.update(data, key)
            return True
        except Exception:
            raise DBException(UPDATE_MESSAGE_DATA_FAILED)

    def get_messages_by_interlocutors(
        self, key: str, interlocutor_keys: str, is_last: bool = True
    ):
        data = []
        for r in interlocutor_keys:
            data.append({"is_last": is_last, "recipient": key, "sender": r})
            data.append({"is_last": is_last, "recipient": r, "sender": key})
        if data:
            messages = self.__db.fetch(data)
            return [MessageInDB(**msg) for msg in messages.items]
        else:
            return []

    def get_messages(
        self,
        key: str,
        interlocutor_key: str,
        limit: int | None = None,
        to_last: str | None = None,
    ):
        data = [
            {"recipient": interlocutor_key, "sender": key},
            {"recipient": key, "sender": interlocutor_key},
        ]
        messages = self.__db.fetch(data, limit=limit, last=to_last)
        return [MessageDisplayingModel(**msg) for msg in messages.items], messages.last

    def get_message(self, key: str, interlocutor_key: str, is_last: bool | None = None):
        data = [
            {"is_last": is_last, "recipient": interlocutor_key, "sender": key},
            {"is_last": is_last, "recipient": key, "sender": interlocutor_key},
        ]
        message = self.__db.fetch(data, limit=1)
        return MessageInDB(**message.items[0]) if message.count > 0 else None

    def put_message(self, message: MessageInDB):
        try:
            return self.__db.put(message.dict())
        except:
            raise DBException(PUT_MESSAGE_FAILED)
