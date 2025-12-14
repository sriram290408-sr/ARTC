from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate

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
def update_status(id: int, status: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        return {"error": "Report not found"}

    report.status = status
    db.commit()
    return {"message": "Status updated"}
