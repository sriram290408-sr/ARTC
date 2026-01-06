from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate
from core.dependency import student_only, get_current_user

router = APIRouter(prefix="/report", tags=["Report"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", dependencies=[Depends(student_only)])
def create_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    report = Report(
        **data.dict(),
        student_id=int(user["sub"])
    )
    db.add(report)
    db.commit()
    return {"message": "Report submitted successfully"}

@router.get("/")
def get_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] == "faculty":
        return db.query(Report).all()
    return db.query(Report).filter(Report.student_id == int(user["sub"])).all()
