from sqlalchemy import Column, Integer, String
from database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    venue = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    link = Column(String, nullable=True)  
