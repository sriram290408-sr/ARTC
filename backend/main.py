from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import engine, Base
from backend.routers import user, report, committee, action_taken, login, profile
import os

app = FastAPI(title="ARTC Backend - Final")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Your routers (UNCHANGED)
app.include_router(user.router)
app.include_router(report.router)
app.include_router(committee.router)
app.include_router(action_taken.router)
app.include_router(login.router)
app.include_router(profile.router)

# -------- FRONTEND SERVING --------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Serve CSS / JS / Images
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "frontend")),
    name="static",
)

# Serve Analysis page
@app.get("/analysis", include_in_schema=False)
def analysis_page():
    return FileResponse(os.path.join(BASE_DIR, "frontend", "analysis.html"))

# Root
@app.get("/", include_in_schema=False)
def root():
    return FileResponse(os.path.join(BASE_DIR, "frontend", "analysis.html"))
