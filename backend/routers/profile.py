from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.profile import Profile
from schemas.profile import ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    return profile

@router.put("/update")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()

    if not profile:
        profile = Profile(**data.dict())
        db.add(profile)
    else:
        for key, value in data.dict().items():
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}
