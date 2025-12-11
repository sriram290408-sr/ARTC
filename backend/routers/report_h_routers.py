from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from backend.model.report_models import Report
from backend.schemas.report_ import ReportCreate, ReportUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/report-history")
def get_report_history(db: Session = Depends(get_db)):
    return db.query(Report).all()
