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
    status: Optional[str] = None

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
    student_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
