from typing import Generic, List, TypeVar
from pydantic import BaseModel

Item = TypeVar("Item")


class PaginatorData(BaseModel, Generic[Item]):
    items: List[Item]
    to_next: str | None = None
    to_current: str | None = None
