from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    student_id = Column(Integer, ForeignKey("users.id"))
