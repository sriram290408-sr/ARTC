from pydantic import BaseModel
from datetime import date, datetime

class ReportCreate(BaseModel):
    title: str
    description: str
    problem_type: str
    incident_location: str
    incident_date: date
    name: str
    class_section: str
    people_involved: str | None = None


class ReportUpdate(BaseModel):
    status: str


class ReportOut(ReportCreate):
    id: int
    status: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
