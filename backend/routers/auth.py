from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import LoginSchema
from models.user import User
from core.hash import verify_password
from core.security import create_access_token

router = APIRouter()

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    role = user.role.lower()
    token = create_access_token({"sub": user.email, "role": role})
    
    return {
        "access_token": token,
        "role": role,
        "name": user.full_name
    }
