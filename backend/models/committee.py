from sqlalchemy import Column, Integer, String
from database import Base

class Committee(Base):
    __tablename__ = "committee"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
