from pydantic import BaseModel
from datetime import date

class ReportCreate(BaseModel):
    title: str
    description: str
    problem_type: str
    incident_location: str
    incident_date: date
    name: str
    class_section: str
    people_involved: str | None = None
