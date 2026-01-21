from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate, ReportOut, ReportUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ReportOut)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    new_report = Report(**report.dict())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/my", response_model=List[ReportOut])
def view_my_reports(name: str, db: Session = Depends(get_db)):
    return db.query(Report).filter(Report.name == name).all()


@router.get("/", response_model=List[ReportOut])
def view_all_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()

@router.get("/analytics")
def report_analytics(db: Session = Depends(get_db)):
    """
    Returns:
    {
        pending: int,
        under_review: int,
        completed: int,
        fake: int,
        total: int
    }
    """

    results = (
        db.query(
            func.lower(func.trim(Report.status)).label("status"),
            func.count(Report.id).label("count")
        )
        .group_by(func.lower(func.trim(Report.status)))
        .all()
    )

    analytics = {
        "pending": 0,
        "under_review": 0,
        "completed": 0,
        "fake": 0,
        "total": 0
    }

    for status, count in results:
        if status in analytics:
            count = int(count)
            analytics[status] = count
            analytics["total"] += count

    return analytics

@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{report_id}", response_model=ReportOut)
def update_report(
    report_id: int,
    data: ReportUpdate,
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = data.status.strip().lower()
    db.commit()
    db.refresh(report)
    return report
