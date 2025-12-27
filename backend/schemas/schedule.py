from datetime import date
from pydantic import BaseModel

class ScheduleCreate(BaseModel):
    title: str
    date: date
    time: str
    venue: str

class ScheduleOut(ScheduleCreate):
    id: int

    class Config:
        orm_mode = True
