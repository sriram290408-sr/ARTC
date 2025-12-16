from sqlalchemy import Column, Integer, String
from backend.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_section = Column(String, nullable=False)
    roll_no = Column(String, nullable=False)
    school = Column(String, nullable=False)
    profile_image = Column(String, default="default.png")
