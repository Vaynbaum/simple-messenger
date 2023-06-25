from fastapi import HTTPException, Security, status, APIRouter
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from controllers.auth_controller import AuthController


from controllers.user_controller import UserController
from exceptions.db_exception import DBException
from exceptions.token_exception import TokenException
from exceptions.user_exception import UserException
from models.paginator import PaginatorData
from models.user import ProfileDisplayingModel, UserDisplayingModel

router = APIRouter()
security = HTTPBearer()
auth_controller = AuthController()
user_controller = UserController(auth_controller)


@router.get("/my", response_model=ProfileDisplayingModel)
async def get_profile(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        return user_controller.get_profile(credentials.credentials)
    except UserException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)


@router.get("/all_users", response_model=PaginatorData[UserDisplayingModel])
async def get_profile(limit: int | None = None, to_next: str | None = None):
    return user_controller.get_all_users(limit, to_next)


@router.delete("/")
async def delete_profile(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    try:
        return user_controller.delete_user(credentials.credentials)
    except TokenException as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    except DBException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.get("/user", response_model=UserDisplayingModel)
async def get_profile(key: str):
    return user_controller.get_user_by_key(key)


@router.get("/change_img")
async def change_img(
    img: str, credentials: HTTPAuthorizationCredentials = Security(security)
):
    return user_controller.change_img(img, credentials.credentials)
