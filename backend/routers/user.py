from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User
from core.security import hash_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        password=hash_password(data["password"]),
        role=data["role"]
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "access_token": token,
        "role": user.role
    }
