from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
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
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    new_report = Report(
        title=report.title,
        description=report.description,
        status="Pending",
        student_id=None,
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@router.get("/my")
def view_my_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Report).filter(Report.student_id == user.id).all()


@router.get("/")
def view_all_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)
    return db.query(Report).all()


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


@router.put("/{report_id}")
def update_report(
    report_id: int,
    data: ReportUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    report = db.query(Report).get(report_id)
    report.title = data.title
    report.content = data.content
    db.commit()
    return {"message": "Report updated"}


# @router.get("/{report_id}", response_model=ReportOut)
# def get_report(
#     report_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
# ):
#     report = db.query(Report).filter(Report.id == report_id).first()

#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")

#     if user["role"] != "faculty" and report.student_id != int(user["sub"]):
#         raise HTTPException(status_code=403, detail="Unauthorized")

#     return report

