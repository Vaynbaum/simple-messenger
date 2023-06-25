from datetime import datetime
import secrets

from common.consts import NAME_OBJECT_MESSAGE
from controllers.auth_controller import AuthController
from controllers.db_controller import DatabaseController
from models.dialog import DialogModel
from models.message import InputMessage, MessageDisplayingModel, MessageInDB
from models.paginator import PaginatorData


class MessageController:
    def __init__(self, auth_controller: AuthController):
        self.__db_controller = DatabaseController()
        self.__auth_controller = auth_controller

    def get_dialogs(self, token: str):
        key = self.__auth_controller.decode_token(token)
        interlocutors = self.__db_controller.get_user_by_key(key).interlocutors
        messages = self.__db_controller.get_messages_by_interlocutors(
            key, interlocutors
        )
        interlocutors = self.__db_controller.get_interlocutors_by_key(interlocutors)
        dialogs = []
        for message in messages:
            for inter in interlocutors:
                if inter.key == message.recipient or inter.key == message.sender:
                    dialogs.append(
                        DialogModel(
                            interlocutor=inter,
                            message=MessageDisplayingModel(**message.dict()),
                        )
                    )
        return dialogs

    def __append_interlocutors(self, sender_key: str, recipient_key: str):
        self.__db_controller.append_interlocutor(sender_key, recipient_key)
        self.__db_controller.append_interlocutor(recipient_key, sender_key)

    def generate_message(self, key: str, message: InputMessage):
        now_datetime = int(datetime.timestamp(datetime.now()))
        large_timestamp = 9999999999
        return MessageInDB(
            is_last=True,
            text=message.text,
            recipient=message.recipient,
            sender=key,
            key=f"{large_timestamp-now_datetime}{secrets.token_hex(8)}",
            created=now_datetime,
            object=NAME_OBJECT_MESSAGE,
        )

    def get_messages(
        self,
        token: str,
        interlocutor_key: str,
        limit: int | None = 1,
        to_last: str | None = None,
    ):
        key = self.__auth_controller.decode_token(token)
        messages, to_next = self.__db_controller.get_messages(
            key, interlocutor_key, limit, to_last
        )
        return PaginatorData(items=messages, to_next=to_next, to_current=to_last)

    def post_message(self, key: str, message_to_db: MessageInDB, recipient: str):
        last_msg = self.__db_controller.get_message(key, recipient, True)
        last_msg_key = last_msg.key if last_msg else None
        if last_msg_key:
            self.__db_controller.update_message({"is_last": False}, last_msg_key)
        else:
            self.__append_interlocutors(key, recipient)
        return self.__db_controller.put_message(message_to_db)
