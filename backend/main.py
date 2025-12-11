from fastapi import FastAPI
from .database import Base, engine
from backend.routers.report_routers import router as ReportRouter

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(ReportRouter)
