from pydantic import BaseModel, EmailStr

class UserSignupSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
