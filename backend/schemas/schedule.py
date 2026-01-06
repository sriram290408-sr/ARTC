from pydantic import BaseModel
from datetime import datetime

class ScheduleCreate(BaseModel):
    title: str
    description: str | None = None
    date: datetime

class ScheduleOut(BaseModel):
    id: int
    title: str
    description: str | None
    date: datetime
    user_id: int

    class Config:
        from_attributes = True
