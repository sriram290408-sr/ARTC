from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class ReportBase(BaseModel):
    title: str
    description: str
    problem_type: str
    incident_location: str
    incident_date: date
    name: str
    class_section: str
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
    created_by: int

    class Config:
        from_attributes = True
