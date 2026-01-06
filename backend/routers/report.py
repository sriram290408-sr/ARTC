from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate, ReportOut
from core.dependency import (
    get_current_user,
    student_only,
    faculty_only
)

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    user=Depends(student_only)
):
    new_report = Report(
        **report.dict(),
        user_id=user.id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "Report submitted successfully"}


@router.get("/my", response_model=list[ReportOut])
def my_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return (
        db.query(Report)
        .filter(Report.user_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )

@router.get("/history", response_model=list[ReportOut])
def all_reports(
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.put("/{id}")
def update_status(
    id: int,
    status: str,
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    db.commit()
    return {"message": "Status updated"}

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    user=Depends(faculty_only)
):
    results = db.query(Report.status, func.count()).group_by(Report.status).all()
    return {k.lower(): v for k, v in results}
