from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.login_log import LoginLog
from backend.schemas.auth import LoginSchema
from backend.models.user import  User

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login_user(data: LoginSchema, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(User.email == data.email, User.password == data.password)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    log = LoginLog(user_id=user.id)
    db.add(log)
    db.commit()

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.full_name,
        "role": user.role,
    }
