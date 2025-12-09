from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from model.report import Report
from schemas.report import ReportCreate, ReportUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/reports")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    try:
        new_report = Report(**report.dict())  
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        return new_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating report: {e}")


@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()


@router.get("/reports/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/reports/{report_id}")
def update_report(report_id: int, updated: ReportUpdate, db: Session = Depends(get_db)):
    report = db.query(Report).get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    for key, value in updated.dict().items():
        setattr(report, key, value)
    
    db.commit()
    db.refresh(report)
    return report

@router.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}
