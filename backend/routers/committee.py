from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.committee import CommitteeMember
from schemas.committee import CommitteeCreate

router = APIRouter(prefix="/committee", tags=["Committee"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def add_member(member: CommitteeCreate, db: Session = Depends(get_db)):
    db.add(CommitteeMember(**member.dict()))
    db.commit()
    return {"message": "Committee member added"}

@router.get("/all")
def get_members(db: Session = Depends(get_db)):
    return db.query(CommitteeMember).all()
