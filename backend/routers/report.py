from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.report import Report
from schemas.report import ReportCreate, ReportUpdate
from dependencies.auth import get_current_user

router = APIRouter(prefix="/reports")

@router.post("/")
def create_report(data: ReportCreate,
                  db: Session = Depends(get_db),
                  user=Depends(get_current_user)):
    if user.role != "student":
        raise HTTPException(status_code=403)

    report = Report(title=data.title, content=data.content, student_id=user.id)
    db.add(report)
    db.commit()
    return {"message": "Report created"}

@router.get("/my")
def my_reports(db: Session = Depends(get_db),
               user=Depends(get_current_user)):
    return db.query(Report).filter(Report.student_id == user.id).all()

@router.get("/")
def all_reports(db: Session = Depends(get_db),
                user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)
    return db.query(Report).all()

@router.put("/{id}")
def update_report(id: int,
                  data: ReportUpdate,
                  db: Session = Depends(get_db),
                  user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)

    report = db.query(Report).get(id)
    report.title = data.title
    report.content = data.content
    db.commit()
    return {"message": "Updated"}
