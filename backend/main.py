from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base
from routers import user, report, committee, login

app = FastAPI(title="ARTC Backend - Final")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user.router)
app.include_router(report.router)
app.include_router(committee.router)
app.include_router(login.router)

@app.get("/")
def root():
    return {"message": "ARTC Backend is running!"}
