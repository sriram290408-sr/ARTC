from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import verify_token

security = HTTPBearer()

def admin_only(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if not payload or payload.get("role") not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Admin access required")

    return payload
