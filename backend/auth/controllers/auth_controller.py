from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import secrets

from common.consts import (
    NAME_OBJECT_USER,
    PAYLOAD_NAME_EXPIRES,
    PAYLOAD_NAME_ISSUEDAT,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    PAYLOAD_NAME_SCOPE,
    PAYLOAD_NAME_SUB,
    TOKEN_TYPE_BEARER,
)

from common.phrases import (
    ACCOUNT_EXISTS,
    CODE_INVALID,
    CODE_SEND_FAILED,
    FAILED_SIGNUP,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    INVALID_TOKEN,
    INVALID_USERNAME,
    PASSWORD_SUCCESS_RESET,
    RESET_PASSWORD_FAILDE,
    SCOPE_TOKEN_INVALID,
    TOKEN_EXPIRED,
    URL_SEND_SUCCESS,
)
from config import settings
from exceptions.db_exception import DBException
from exceptions.recover_exception import RecoverException
from exceptions.reset_exception import ResetException
from exceptions.signin_exception import SigninException
from exceptions.signup_exception import SignupException
from exceptions.token_exception import TokenException
from models.message import MessageModel
from models.recover import RecoverDataModel
from models.token import Tokens
from models.user import SigninModel, SignupModel, UserModelInDB


class AuthController:
    def __init__(self, database_controller):
        self.__pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.__database_controller = database_controller

    def signin(self, user_details: SigninModel) -> Tokens:
        user = self.__database_controller.get_user_by_email(user_details.username)
        if user is None:
            raise SigninException(INVALID_USERNAME)
        if not self.__verify_password(user_details.password, user.password):
            raise SigninException(INVALID_PASSWORD)
        return self.__generate_tokens(user.key)

    def signup(self, user_details: SignupModel):
        if self.__database_controller.get_user_by_email(user_details.email):
            raise SignupException(ACCOUNT_EXISTS)
        try:
            res = self.__database_controller.put_user(
                UserModelInDB(
                    fullname=user_details.fullname,
                    email=user_details.email,
                    password=self.__get_password_hash(user_details.password),
                    object=NAME_OBJECT_USER,
                )
            )
            res.double_key = res.key
        except DBException:
            raise SignupException(FAILED_SIGNUP)
        return self.__generate_tokens(res.key), res

    def refresh_token(self, refresh_token: str):
        key = self.__decode_token(refresh_token, REFRESH_TOKEN)
        return self.__generate_tokens(key)

    def reset_password(self, code: str, password: str):
        recover_data = self.__database_controller.get_recover_data(code)
        if recover_data:
            try:
                self.__database_controller.update_user_data(
                    {"password": self.__get_password_hash(password)},
                    recover_data.user_key,
                )
                self.__database_controller.delete_recover_data(recover_data.key)
                return MessageModel(message=PASSWORD_SUCCESS_RESET)
            except DBException:
                raise ResetException(RESET_PASSWORD_FAILDE)
        raise ResetException(CODE_INVALID)

    def recover_password(self, email: str):
        user = self.__database_controller.get_user_by_email(email)
        if user is None:
            raise RecoverException(INVALID_EMAIL)
        code = secrets.token_urlsafe()
        res = self.__database_controller.put_recover_code(
            RecoverDataModel(code=code, user_key=user.key)
        )
        if res:
            return (
                MessageModel(message=URL_SEND_SUCCESS),
                f"{settings.URL_NEW_PASSWORD}/auth/reset?code={code}",
            )
        else:
            raise RecoverException(CODE_SEND_FAILED)

    def __decode_token(self, token: str, scope: str) -> str:
        try:
            payload = jwt.decode(
                token, settings.SECRET_STRING, algorithms=[settings.ALGORITHM]
            )
            if payload[PAYLOAD_NAME_SCOPE] == scope:
                return payload[PAYLOAD_NAME_SUB]
            raise TokenException(SCOPE_TOKEN_INVALID)
        except jwt.ExpiredSignatureError:
            raise TokenException(TOKEN_EXPIRED)
        except jwt.InvalidTokenError:
            raise TokenException(INVALID_TOKEN)

    def __generate_tokens(self, key: str):
        access_token = self.__generate_token(
            {
                PAYLOAD_NAME_EXPIRES: datetime.utcnow()
                + timedelta(days=0, minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
                PAYLOAD_NAME_ISSUEDAT: datetime.utcnow(),
                PAYLOAD_NAME_SCOPE: ACCESS_TOKEN,
                PAYLOAD_NAME_SUB: key,
            }
        )
        refresh_token = self.__generate_token(
            {
                PAYLOAD_NAME_EXPIRES: datetime.utcnow()
                + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
                PAYLOAD_NAME_ISSUEDAT: datetime.utcnow(),
                PAYLOAD_NAME_SCOPE: REFRESH_TOKEN,
                PAYLOAD_NAME_SUB: key,
            }
        )
        return Tokens(
            access_token=access_token,
            token_type=TOKEN_TYPE_BEARER,
            refresh_token=refresh_token,
        )

    def __verify_password(self, plain_password, hashed_password):
        return self.__pwd_context.verify(plain_password, hashed_password)

    def __get_password_hash(self, password):
        return self.__pwd_context.hash(password)

    def __generate_token(self, payload):
        return jwt.encode(payload, settings.SECRET_STRING, algorithm=settings.ALGORITHM)
