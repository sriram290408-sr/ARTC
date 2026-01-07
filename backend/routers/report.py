from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate, ReportOut, ReportUpdate
from dependencies.auth import get_current_user

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
    user=Depends(get_current_user),
):
    new_report = Report(
        title=report.title,
        description=report.description,
        problem_type=report.problem_type,
        incident_location=report.incident_location,
        incident_date=report.incident_date,
        name=report.name,
        class_section=report.class_section,
        people_involved=report.people_involved,
        status="Pending",
        student_id=user.id,
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/my", response_model=list[ReportOut])
def view_my_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return (
        db.query(Report)
        .filter(Report.student_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )

@router.get("/", response_model=list[ReportOut])
def view_all_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.get("/{report_id}", response_model=ReportOut)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return report

@router.put("/{report_id}", response_model=ReportOut)
def update_report(
    report_id: int,
    data: ReportUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if data.status:
        report.status = data.status

    db.commit()
    db.refresh(report)
    return report
