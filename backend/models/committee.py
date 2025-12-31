
from sqlalchemy import Column, Integer, String
from database import Base

class CommitteeMember(Base):
    __tablename__ = "committee_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
