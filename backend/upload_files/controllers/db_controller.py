from deta import Deta
from config import settings

from models.user import UserModelInDB


class DatabaseController:
    def __init__(self):
        deta = Deta(settings.DETA_PROJECT_KEY)
        self.__db = deta.Base(settings.DETA_NAME_BASE)

    def get_user_by_key(self, key: str):
        user = self.__db.get(key)
        return UserModelInDB(**user) if user else None
