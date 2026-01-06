from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate, ReportOut
from core.dependency import admin_only, get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# USER: CREATE REPORT
@router.post("/create")
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    new_report = Report(
        **report.dict(),
        user_id=user.id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "Report submitted successfully"}

# USER: OWN REPORT HISTORY
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

@router.get("/history", response_model=list[ReportOut], dependencies=[Depends(admin_only)])
def all_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.get("/{id}", response_model=ReportOut, dependencies=[Depends(admin_only)])
def get_report(id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{id}", dependencies=[Depends(admin_only)])
def update_status(
    id: int,
    status: str,
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    db.commit()
    return {"message": "Status updated"}

@router.get("/analytics", dependencies=[Depends(admin_only)])
def analytics(db: Session = Depends(get_db)):
    results = db.query(Report.status, func.count()).group_by(Report.status).all()
    return {k: v for k, v in results}
