from pydantic import BaseModel
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    description: str

class ReportCreate(ReportBase):
    pass

class ReportOut(ReportBase):
    id: int
    created_at: datetime
    created_by: str
    class Config:
        orm_mode = True
