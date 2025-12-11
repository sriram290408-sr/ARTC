from pydantic import BaseModel
from typing import Optional
from datetime import date

class ReportCreate(BaseModel):
    name: str
    class_section: str
    problem_type: str
    location: str
    date_of_incident: date  
    description: str
    people_involved: Optional[str] = None
    privacy_option: bool

class ReportUpdate(BaseModel):
    name: str
    class_section: str
    problem_type: str
    location: str
    date_of_incident: date  
    description: str
    people_involved: Optional[str] = None
    privacy_option: bool
