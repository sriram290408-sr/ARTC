from pydantic import BaseModel, EmailStr
from typing import Optional

class CommitteeCreate(BaseModel):
    name: str
    designation: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin: Optional[str] = None

class CommitteeOut(CommitteeCreate):
    id: int

    class Config:
        from_attributes = True
