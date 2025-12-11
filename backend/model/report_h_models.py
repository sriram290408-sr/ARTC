from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_section = Column(String, nullable=False)
    problem_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date_of_incident = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    people_involved = Column(String, nullable=True)
    privacy_option = Column(Boolean, default=True)
    assignee = Column(String, nullable=True)  # optional field
