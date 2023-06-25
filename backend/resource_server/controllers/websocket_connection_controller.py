from fastapi import WebSocket

from models.message import MessageInDB


class ConnectionManager:
    def __init__(self):
        self.__active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, key: str):
        if key:
            await websocket.accept()
            if key not in self.__active_connections:
                self.__active_connections[key] = websocket

    def disconnect(self, key: str):
        if key in self.__active_connections:
            s = self.__active_connections.pop(key)
            s.close()

    async def send_personal_message(self, message: MessageInDB, key: str):
        if key in self.__active_connections:
            await self.__active_connections[key].send_json(message.dict())

    async def broadcast(self, message: str):
        for connection in self.__active_connections.values():
            await connection.send_text(message)
