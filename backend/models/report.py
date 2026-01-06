# backend/models/report.py
from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    created_by = Column(String, nullable=False)  
