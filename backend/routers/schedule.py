from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate, ScheduleOut
from core.dependency import get_current_user, student_only, faculty_only

router = APIRouter(prefix="/schedule", tags=["Schedule"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    user=Depends(student_only)
):
    new_schedule = Schedule(
        **schedule.dict(),
        user_id=user.id
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return {"message": "Schedule added successfully"}

@router.get("/my", response_model=list[ScheduleOut])
def my_schedules(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Schedule).filter(Schedule.user_id == user.id).order_by(Schedule.date.desc()).all()

@router.get("/all", response_model=list[ScheduleOut])
def all_schedules(
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    return db.query(Schedule).order_by(Schedule.date.desc()).all()

@router.put("/{id}")
def update_schedule(
    id: int,
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    s = db.query(Schedule).filter(Schedule.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")

    s.title = schedule.title
    s.description = schedule.description
    s.date = schedule.date
    db.commit()
    return {"message": "Schedule updated successfully"}

@router.delete("/{id}")
def delete_schedule(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    s = db.query(Schedule).filter(Schedule.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(s)
    db.commit()
    return {"message": "Schedule deleted successfully"}
