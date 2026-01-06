from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
