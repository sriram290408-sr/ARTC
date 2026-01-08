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
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
):
    new_report = Report(**report.dict())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


@router.get("/my", response_model=List[ReportOut])
def view_my_reports(
    name: str,
    db: Session = Depends(get_db),
):
    return db.query(Report).filter(Report.name == name).all()


@router.get("/", response_model=List[ReportOut])
def view_all_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()


@router.get("/analytics")
def report_analytics(db: Session = Depends(get_db)):
    statuses = ["pending", "under_review", "completed", "fake"]

    analytics = {}
    for status in statuses:
        analytics[status] = (
            db.query(func.count(Report.id)).filter(Report.status == status).scalar()
        )

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

    report.status = data.status
    db.commit()
    db.refresh(report)
    return report
