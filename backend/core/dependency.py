from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import SessionLocal
from core.security import verify_token

security = HTTPBearer(auto_error=False)

def admin_only(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token missing"
        )

    payload = verify_token(credentials.credentials)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    if payload.get("role") not in ["admin", "faculty"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or faculty access required"
        )

    return payload


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
