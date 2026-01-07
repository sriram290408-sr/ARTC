from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import LoginSchema
from models.user import User
from models.auth import LoginLog
from core.hash import verify_password
from core.security import create_access_token

router = APIRouter()

@router.post("/login", status_code=status.HTTP_200_OK)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    role = user.role.lower()

    token = create_access_token({
        "sub": user.email,
        "role": role
    })

    # save login history
    db.add(LoginLog(user_id=user.id))
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role,
        "name": user.full_name
    }
