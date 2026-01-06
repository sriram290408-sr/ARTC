from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate
from core.dependency import faculty_only

router = APIRouter(prefix="/schedule", tags=["Schedule"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_schedules(db: Session = Depends(get_db)):
    return db.query(Schedule).order_by(Schedule.date.asc()).all()

@router.post("/", dependencies=[Depends(faculty_only)])
def create_schedule(data: ScheduleCreate, db: Session = Depends(get_db)):
    schedule = Schedule(**data.dict())
    db.add(schedule)
    db.commit()
    return {"message": "Schedule added successfully"}

@router.delete("/{schedule_id}", dependencies=[Depends(faculty_only)])
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted"}
