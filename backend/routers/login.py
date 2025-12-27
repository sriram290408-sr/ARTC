from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.user import User
from backend.models.login_log import LoginLog
from backend.schemas.auth import LoginSchema
from backend.core.hash import verify_password
from backend.core.security import create_access_token

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    db.add(LoginLog(user_id=user.id))
    db.commit()

    return {
        "access_token": token,
        "user": {
            "name": user.full_name,
            "role": user.role
        }
    }
