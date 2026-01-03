from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import user, report, committee, login

app = FastAPI(title="ARTC Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-frontend.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(report.router)
app.include_router(committee.router)
app.include_router(login.router)

@app.get("/")
def root():
    return {"message": "ARTC Backend is running"}
