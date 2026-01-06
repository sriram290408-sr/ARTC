from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.committee import Committee
from schemas.committee import CommitteeCreate
from dependencies.auth import get_current_user

router = APIRouter(prefix="/committee")

@router.post("/")
def add(data: CommitteeCreate,
        db: Session = Depends(get_db),
        user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    member = Committee(**data.dict())
    db.add(member)
    db.commit()
    return {"message": "Added"}

@router.get("/")
def view(db: Session = Depends(get_db),
         user=Depends(get_current_user)):
    return db.query(Committee).all()

@router.delete("/{id}")
def delete(id: int,
           db: Session = Depends(get_db),
           user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    m = db.query(Committee).get(id)
    db.delete(m)
    db.commit()
    return {"message": "Deleted"}
