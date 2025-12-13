
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.action_taken import ActionTaken
from schemas.action_taken import ActionCreate

router = APIRouter(prefix="/actions", tags=["Action Taken"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_action(action: ActionCreate, db: Session = Depends(get_db)):
    db.add(ActionTaken(**action.dict()))
    db.commit()
    return {"message": "Action recorded"}

@router.get("/report/{report_id}")
def get_actions(report_id: int, db: Session = Depends(get_db)):
    return db.query(ActionTaken).filter(ActionTaken.report_id == report_id).all()
