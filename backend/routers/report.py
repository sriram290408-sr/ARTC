from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate
from core.dependency import admin_only

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    new_report = Report(**report.dict())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "Report submitted successfully"}

@router.get("/history")
def get_report_history(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.put("/status/{id}")
def update_status(
    id: int,
    status: str,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    db.commit()
    return {"message": "Status updated"}

@router.get("/analytics")
def report_analytics(
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):
    results = (
        db.query(Report.status, func.count(Report.id))
        .group_by(Report.status)
        .all()
    )

    data = {
        "pending": 0,
        "completed": 0,
        "fake": 0
    }

    for status, count in results:
        data[status] = count

    return data

@router.get("/analytics/public")
def public_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(Report.status, func.count(Report.id))
        .group_by(Report.status)
        .all()
    )

    data = {
        "pending": 0,
        "completed": 0,
        "fake": 0
    }

    for status, count in results:
        data[status] = count

    return data