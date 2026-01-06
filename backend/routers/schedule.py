from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.schedule import Schedule
from schemas.schedule import ScheduleCreate
from dependencies.auth import get_current_user

router = APIRouter()

@router.post("/")
def create(data: ScheduleCreate,
           db: Session = Depends(get_db),
           user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    s = Schedule(**data.dict())
    db.add(s)
    db.commit()
    return {"message": "Created"}

@router.get("/")
def view(db: Session = Depends(get_db),
         user=Depends(get_current_user)):
    return db.query(Schedule).all()

@router.delete("/{id}")
def delete(id: int,
           db: Session = Depends(get_db),
           user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    s = db.query(Schedule).get(id)
    db.delete(s)
    db.commit()
    return {"message": "Deleted"}
