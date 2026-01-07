from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    problem_type = Column(String, nullable=True)
    incident_location = Column(String, nullable=True)
    incident_date = Column(DateTime, nullable=True)
    name = Column(String, nullable=True)
    class_section = Column(String, nullable=True)
    people_involved = Column(String, nullable=True)
    status = Column(String, default="Pending") 
    remarks = Column(String, nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
