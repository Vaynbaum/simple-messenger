import random
import string
from fastapi import FastAPI, File, HTTPException, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from deta import Deta

from config import settings
from controllers.auth_controller import AuthController
from controllers.db_controller import DatabaseController
from exceptions.token_exception import TokenException

app = FastAPI()
deta = Deta(settings.DETA_PROJECT_KEY)
drive = deta.Drive(settings.DETA_NAME_DRIVE)
security = HTTPBearer()
auth_controller = AuthController()
db_controller = DatabaseController()


def generate_img_name_by_key(key: str):
    return f"{key}.jpg"


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.delete("/")
def delete_img(
    filename: str | None = None,
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    try:
        key = auth_controller.decode_token(credentials.credentials)
    except TokenException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    if filename:
        user = db_controller.get_user_by_key(key)
        if user and user.img == filename:
            return drive.delete(filename)
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    else:
        return drive.delete(generate_img_name_by_key(key))


@app.post("/")
def upload_img(
    file: UploadFile = File(...),
    filename: str | None = None,
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    try:
        key = auth_controller.decode_token(credentials.credentials)
    except TokenException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    res = drive.put(filename if filename else generate_img_name_by_key(key), file.file)
    return f"{random.choice(string.ascii_letters)}/{res}"


@app.get("/{symbol}/{name}")
def download_img(symbol: str, name: str):
    return StreamingResponse(drive.get(name).iter_chunks(2048), media_type="image/jpg")
