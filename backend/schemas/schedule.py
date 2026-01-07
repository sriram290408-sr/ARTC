from pydantic import BaseModel

class ScheduleCreate(BaseModel):
    title: str
    venue: str
    date: str
    time: str

class ScheduleOut(ScheduleCreate):
    id: int

    class Config:
        from_attributes = True
