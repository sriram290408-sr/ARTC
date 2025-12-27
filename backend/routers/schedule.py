from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.schedule import Schedule
from backend.schemas.schedule import ScheduleCreate

router = APIRouter(prefix="/schedule", tags=["Schedule"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/add")
def add_schedule(data: ScheduleCreate, db: Session = Depends(get_db)):
    schedule = Schedule(**data.dict())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("/all")
def get_schedules(db: Session = Depends(get_db)):
    return db.query(Schedule).order_by(Schedule.date).all()


@router.delete("/delete/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if schedule:
        db.delete(schedule)
        db.commit()
    return {"message": "Deleted"}
