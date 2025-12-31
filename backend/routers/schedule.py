from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate
from core.dependency import admin_only

router = APIRouter(prefix="/schedule", tags=["Schedule"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", dependencies=[Depends(admin_only)])
def create_schedule(
    data: ScheduleCreate,
    db: Session = Depends(get_db)
):
    schedule = Schedule(**data.dict())
    db.add(schedule)
    db.commit()
    return {"message": "Schedule added"}

@router.get("/")
def get_schedule(db: Session = Depends(get_db)):
    return db.query(Schedule).all()

@router.delete("/{schedule_id}", dependencies=[Depends(admin_only)])
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if schedule:
        db.delete(schedule)
        db.commit()
    return {"message": "Schedule removed"}
