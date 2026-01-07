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
def create_report(data: ReportCreate, db: Session = Depends(get_db)):
    report = Report(**data.dict())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.get("/my", response_model=list[ReportOut])
def get_my_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Report).filter(Report.student_id == int(user["sub"])).all()


@router.get("/{report_id}", response_model=ReportOut)
def get_report(
    report_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if user["role"] != "faculty" and report.student_id != int(user["sub"]):
        raise HTTPException(status_code=403, detail="Unauthorized")

    return report


@router.put("/{report_id}", response_model=ReportOut)
def update_report(
    report_id: int,
    data: ReportUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user["role"] != "faculty":
        raise HTTPException(status_code=403, detail="Unauthorized")

    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(report, key, value)

    db.commit()
    db.refresh(report)
    return report


@router.get("/analytics")
def report_analytics(db: Session = Depends(get_db)):
    pending = db.query(Report).filter(Report.status == "Pending").count()
    under_review = db.query(Report).filter(Report.status == "Under Review").count()
    completed = db.query(Report).filter(Report.status == "Completed").count()
    fake = db.query(Report).filter(Report.status == "Fake").count()

    return {
        "pending": pending,
        "under_review": under_review,
        "completed": completed,
        "fake": fake,
    }
