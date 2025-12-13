
from pydantic import BaseModel

class ActionCreate(BaseModel):
    report_id: int
    action_description: str
    taken_by: str
