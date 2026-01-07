from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class ReportBase(BaseModel):
    title: str
    description: str
    problem_type: Optional[str] = None
    incident_location: Optional[str] = None
    incident_date: Optional[date] = None
    name: Optional[str] = None
    class_section: Optional[str] = None
    people_involved: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None

class ReportOut(ReportBase):
    id: int
    status: str
    created_at: datetime
    student_id: int  

    class Config:
        from_attributes = True
