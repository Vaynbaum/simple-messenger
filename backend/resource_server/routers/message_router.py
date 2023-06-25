from typing import List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Security,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from controllers.auth_controller import AuthController
from controllers.message_controller import MessageController
from controllers.websocket_connection_controller import ConnectionManager
from exceptions.db_exception import DBException
from exceptions.token_exception import TokenException
from exceptions.user_exception import UserException
from models.dialog import DialogModel
from models.message import InputMessage, MessageDisplayingModel

from models.paginator import PaginatorData

router = APIRouter()
security = HTTPBearer()
auth_controller = AuthController()
message_controller = MessageController(auth_controller)
websocket_manager = ConnectionManager()


def get_token(token: str):
    if token is None:
        return None
    try:
        return auth_controller.decode_token(token)
    except TokenException as e:
        print(e)
        return None


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    key: str | None = Depends(get_token),
):
    if key:
        await websocket_manager.connect(websocket, key)
        try:
            while True:
                data = await websocket.receive_json()
                msg = InputMessage(**data)
                message = message_controller.generate_message(key, msg)
                await websocket_manager.send_personal_message(message, msg.recipient)
                try:
                    message_controller.post_message(key, message, msg.recipient)
                except DBException as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, detail=e.message
                    )
        except WebSocketDisconnect:
            websocket_manager.disconnect(key)


@router.get("/get_dialogs", response_model=List[DialogModel])
async def get_dialogs(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        return message_controller.get_dialogs(credentials.credentials)
    except TokenException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.get("/my_messages", response_model=PaginatorData[MessageDisplayingModel])
async def get_profile(
    interlocutor_key: str,
    credentials: HTTPAuthorizationCredentials = Security(security),
    limit: int | None = None,
    to_last: str | None = None,
):
    try:
        return message_controller.get_messages(
            credentials.credentials, interlocutor_key, limit, to_last
        )
    except UserException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
