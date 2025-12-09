from fastapi import FastAPI
from database import Base, engine
from routers.report import router as ReportRouter

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(ReportRouter)
