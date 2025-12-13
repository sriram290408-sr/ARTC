
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
    db.add(Report(**report.dict()))
    db.commit()
    return {"message": "Report submitted"}

@router.get("/history")
def history(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.put("/status/{id}")
def update_status(id: int, status: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    report.status = status
    db.commit()
    return {"message": "Status updated"}
