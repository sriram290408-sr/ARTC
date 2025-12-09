from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base  

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))  
    class_section = Column(String(50))
    problem_type = Column(String(50))
    location = Column(String(100))
    date_of_incident = Column(Date)
    description = Column(String(500))
    people_involved = Column(String(200))
    privacy_option = Column(Boolean)  
