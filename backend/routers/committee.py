from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.committee import Committee
from schemas.committee import CommitteeCreate, CommitteeOut
from dependencies.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CommitteeOut)
def add_member(
    data: CommitteeCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "faculty":
        raise HTTPException(status_code=403, detail="Faculty only")

    member = Committee(**data.dict())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("/", response_model=list[CommitteeOut])
def view_members(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Committee).all()


@router.delete("/{id}")
def delete_member(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "faculty":
        raise HTTPException(status_code=403, detail="Faculty only")

    member = db.query(Committee).filter(Committee.id == id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(member)
    db.commit()
    return {"message": "Deleted"}
