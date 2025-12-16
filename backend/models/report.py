from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from datetime import datetime
from backend.database import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    problem_type = Column(String, nullable=False)
    incident_location = Column(String, nullable=False)
    incident_date = Column(Date, nullable=False)
    status = Column(String, default="Pending")
    name = Column(String, nullable=False)
    class_section = Column(String, nullable=False)
    people_involved = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
