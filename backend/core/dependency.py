from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.security import verify_token

oauth2 = OAuth2PasswordBearer(tokenUrl="auth/login")

def admin_only(token: str = Depends(oauth2)):
    payload = verify_token(token)
    if not payload or payload.get("role") not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Admin access only")
    return payload
