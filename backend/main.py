from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import user, report, committee, action_taken, login

app = FastAPI(title="ARTC Backend - Final")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include all routers
app.include_router(user.router)
app.include_router(report.router)
app.include_router(committee.router)
app.include_router(action_taken.router)
app.include_router(login.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "ARTC Backend is running!"}
