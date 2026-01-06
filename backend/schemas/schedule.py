from pydantic import BaseModel
from datetime import date, time

class ScheduleBase(BaseModel):
    title: str
    venue: str
    date: date
    time: time

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleOut(ScheduleBase):
    id: int
    class Config:
        from_attributes = True
