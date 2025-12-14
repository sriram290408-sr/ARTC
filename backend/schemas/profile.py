from pydantic import BaseModel

class ProfileUpdate(BaseModel):
    name: str
    class_section: str
    roll_no: str
    school: str
    profile_image: str | None = None
