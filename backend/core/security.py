from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "SECRET123"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    data["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)