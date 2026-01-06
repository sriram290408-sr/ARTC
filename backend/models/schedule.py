from sqlalchemy import Column, Integer, String
from database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    date = Column(String)
    time = Column(String)
