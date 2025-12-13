
from fastapi import FastAPI
from database import engine, Base
from routers import user, report, committee, action_taken, login

app = FastAPI(title="ARTC Backend - Final")

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(report.router)
app.include_router(committee.router)
app.include_router(action_taken.router)
app.include_router(login.router)