from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ReportCreate(BaseModel):
    title: str
    description: str
    problem_type: str
    incident_location: str
    incident_date: date
    name: str
    class_section: str
    people_involved: Optional[str] = None

class ReportUpdate(BaseModel):
    status: str

class ReportOut(BaseModel):
    id: int
    title: str
    description: str
    problem_type: str
    incident_location: str
    incident_date: date
    name: str
    class_section: str
    people_involved: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
