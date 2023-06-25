from common.consts import NAME_OBJECT_DELETED_USER
from common.phrases import FULLNAME_DELETED_USER
from controllers.auth_controller import AuthController
from controllers.db_controller import DatabaseController
from exceptions.token_exception import TokenException
from exceptions.user_exception import UserException
from models.paginator import PaginatorData


class UserController:
    def __init__(self, auth_controller: AuthController):
        self.__db_controller = DatabaseController()
        self.__auth_controller = auth_controller

    def get_profile(self, token: str):
        try:
            key = self.__auth_controller.decode_token(token)
            return self.__db_controller.get_user_by_key(key)
        except TokenException as e:
            raise UserException(e.message)

    def delete_user(self, token: str):
        key = self.__auth_controller.decode_token(token)
        return self.__db_controller.update_user(
            {
                "fullname": FULLNAME_DELETED_USER,
                "object": NAME_OBJECT_DELETED_USER,
                "email": "",
                "img": "",
                "password": "",
            },
            key,
        )

    def get_all_users(
        self,
        limit: int | None = None,
        to_next: str | None = None,
    ):
        result, next = self.__db_controller.get_all_users(limit, to_next)
        return PaginatorData(items=result, to_next=next, to_current=to_next)

    def change_img(self, img: str, token: str):
        key = self.__auth_controller.decode_token(token)
        return self.__db_controller.update_user({"img": img}, key)

    def get_user_by_key(self, key: str):
        return self.__db_controller.get_user_by_key(key)
