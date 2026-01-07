from pydantic import BaseModel, EmailStr

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes  = True
