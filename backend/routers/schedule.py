from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate, ScheduleOut
from core.dependency import get_current_user, admin_only

router = APIRouter()

@router.get("/schedule/all", response_model=list[ScheduleOut])
def get_all_schedules(db: Session = Depends(get_db)):
    return db.query(Schedule).order_by(Schedule.date.desc()).all()

@router.post("/schedule", response_model=ScheduleOut)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db), user = Depends(admin_only)):
    new_schedule = Schedule(**schedule.dict())
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return new_schedule

@router.delete("/schedule/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db), user = Depends(admin_only)):
    schedule = db.query(Schedule).get(schedule_id)
    if not schedule:
        return {"error": "Schedule not found"}
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted"}
