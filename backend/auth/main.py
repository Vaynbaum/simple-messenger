from fastapi import BackgroundTasks, FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import EmailStr
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from controllers.auth_controller import AuthController
from controllers.db_controller import DatabaseController
from controllers.mailer_controller import MailerController
from exceptions.recover_exception import RecoverException
from exceptions.reset_exception import ResetException
from exceptions.signin_exception import SigninException
from exceptions.signup_exception import SignupException
from exceptions.token_exception import TokenException
from models.message import MessageModel
from models.token import Tokens
from models.user import SigninModel, SignupModel

db_controller = DatabaseController()
mailer_controller = MailerController()
auth_controller = AuthController(db_controller)
security = HTTPBearer()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/signin", response_model=Tokens)
async def signin(user_details: SigninModel, background_tasks: BackgroundTasks):
    try:
        res = auth_controller.signin(user_details)
        background_tasks.add_task(
            mailer_controller.send_warn_signin, user_details.username
        )
        return res
    except SigninException as e:
        raise HTTPException(status_code=401, detail=e.message)


@app.post("/signup", response_model=Tokens)
async def signup(user_details: SignupModel, background_tasks: BackgroundTasks):
    try:
        res, user = auth_controller.signup(user_details)
        background_tasks.add_task(db_controller.put_user, user)
        background_tasks.add_task(
            mailer_controller.send_greeting, user_details.email, user_details.fullname
        )
        return res
    except SignupException as e:
        raise HTTPException(status_code=401, detail=e.message)


@app.get("/refresh_token", response_model=Tokens)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        return auth_controller.refresh_token(credentials.credentials)
    except TokenException as e:
        raise HTTPException(status_code=401, detail=e.message)


@app.get("/recover_password", response_model=MessageModel)
async def recover_password(email: EmailStr, background_tasks: BackgroundTasks):
    try:
        res = auth_controller.recover_password(email)
        background_tasks.add_task(mailer_controller.send_url, email, res[1])
        return res[0]
    except RecoverException as e:
        raise HTTPException(status_code=400, detail=e.message)


@app.get("/reset")
async def reset_password(code: str, new_password: str):
    try:
        return auth_controller.reset_password(code, new_password)
    except ResetException as e:
        raise HTTPException(status_code=400, detail=e.message)
