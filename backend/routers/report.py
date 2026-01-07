from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.report import Report
from schemas.report import ReportCreate, ReportOut, ReportUpdate
from dependencies.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])


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
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can create reports")

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

@router.get("/my")
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

@router.get("/")
def view_all_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403)
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

    if user.role != "admin" and report.student_id != user.id:
        raise HTTPException(status_code=403)

    return report

@router.put("/{report_id}")
def update_report(
    report_id: int,
    data: ReportUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404)

    report.status = data.status
    report.remarks = data.remarks

    db.commit()
    return {"message": "Report updated successfully"}


@router.get("/analytics")
def report_analytics(db: Session = Depends(get_db)):
    return {
        "pending": db.query(Report).filter(Report.status == "Pending").count(),
        "under_review": db.query(Report).filter(Report.status == "Under Review").count(),
        "completed": db.query(Report).filter(Report.status == "Completed").count(),
        "fake": db.query(Report).filter(Report.status == "Fake").count(),
    }
