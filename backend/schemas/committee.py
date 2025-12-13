
from pydantic import BaseModel

class CommitteeCreate(BaseModel):
    name: str
    role: str
    email: str
    phone: str
