# backend/core/dependency.py
from fastapi import Depends, HTTPException, status
from models.user import User
from jose import jwt
from core.config import SECRET_KEY, ALGORITHM

def get_current_user(token: str = Depends(...)) -> User:
    # decode token and return User object
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return User(**payload)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def admin_only(user: User = Depends(get_current_user)):
    if user.role != "faculty":  # faculty = admin
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
