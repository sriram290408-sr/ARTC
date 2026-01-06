from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.report import Report
from schemas.report import ReportCreate, ReportOut
from core.dependency import get_current_user

router = APIRouter()

@router.get("/reports/history", response_model=list[ReportOut])
def get_reports(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.post("/reports", response_model=ReportOut)
def create_report(report: ReportCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    new_report = Report(
        title=report.title,
        description=report.description,
        created_at=datetime.utcnow(),
        created_by=user.role  
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report
