from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

# IMPORT MODELS (MANDATORY)
from models.user import User
from models.schedule import Schedule
from models.committee import CommitteeMember
from models.report import Report
from models.login_log import LoginLog

from routers.user import router as user_router
from routers.schedule import router as schedule_router
from routers.committee import router as committee_router
from routers.report import router as report_router
from routers.auth import router as login_logs_router

app = FastAPI(title="Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend is running successfully"}

app.include_router(user_router)
app.include_router(schedule_router)
app.include_router(committee_router)
app.include_router(report_router)
app.include_router(login_logs_router)
