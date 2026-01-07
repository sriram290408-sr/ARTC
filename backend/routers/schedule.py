from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate, ScheduleOut
from dependencies.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ScheduleOut)
def create_schedule(
    data: ScheduleCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "faculty":
        raise HTTPException(status_code=403, detail="Faculty only")

    schedule = Schedule(**data.dict())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("/", response_model=list[ScheduleOut])
def get_schedules(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Schedule).all()


@router.delete("/{id}")
def delete_schedule(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "faculty":
        raise HTTPException(status_code=403, detail="Faculty only")

    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(schedule)
    db.commit()
    return {"message": "Deleted"}
