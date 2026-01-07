from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    problem_type = Column(String(100), nullable=False)
    incident_location = Column(String(255), nullable=False)
    incident_date = Column(Date, nullable=False)
    name = Column(String(150), nullable=False)
    class_section = Column(String(100), nullable=False)
    people_involved = Column(String(255), nullable=True)
    status = Column(String(50), default="Pending", nullable=False)
    student_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
