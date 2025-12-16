
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from backend.database import Base

class ActionTaken(Base):
    __tablename__ = "actions_taken"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    action_description = Column(Text, nullable=False)
    taken_by = Column(String, nullable=False)
    action_date = Column(DateTime, default=datetime.utcnow)
