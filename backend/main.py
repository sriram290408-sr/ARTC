from fastapi import FastAPI
from database import Base, engine
from routers.report import router as ReportRouter

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include report routes
app.include_router(ReportRouter)
