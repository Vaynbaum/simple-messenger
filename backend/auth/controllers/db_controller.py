from deta import Deta
from common.phrases import (
    PUT_RECOVER_DATA_FAILDE,
    PUT_USER_DATA_FAILDE,
    UPDATE_USER_DATA_FAILDE,
)
from config import settings
from exceptions.db_exception import DBException
from models.recover import RecoverDataModel

from models.user import UserModelInDB


class DatabaseController:
    def __init__(self):
        deta = Deta(settings.DETA_PROJECT_KEY)
        self.__db = deta.Base(settings.DETA_NAME_BASE)
        self.__recover_db = deta.Base(settings.DETA_NAME_BASE_RECOVER_PASSWORD)

    def get_user_by_email(self, email: str):
        user = self.__db.fetch({"email": email}, limit=1)
        return UserModelInDB(**user.items[0]) if user.count > 0 else None

    def put_user(self, user: UserModelInDB):
        try:
            return UserModelInDB(**self.__db.put(user.dict()))
        except Exception:
            raise DBException(PUT_USER_DATA_FAILDE)

    def update_user_data(self, data: dict, key: str):
        try:
            self.__db.update(data, key)
            return True
        except Exception:
            raise DBException(UPDATE_USER_DATA_FAILDE)

    def put_recover_code(self, data: RecoverDataModel):
        expire_in_minutes = 10
        code_expire_in = expire_in_minutes * 60
        try:
            return self.__recover_db.put(data.dict(), expire_in=code_expire_in)
        except:
            raise DBException(PUT_RECOVER_DATA_FAILDE)

    def get_recover_data(self, code: str):
        recover_data = self.__recover_db.fetch({"code": code}, limit=1)
        return (
            RecoverDataModel(**recover_data.items[0])
            if recover_data.count > 0
            else None
        )

    def delete_recover_data(self, key: str):
        self.__recover_db.delete(key)
