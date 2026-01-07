from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from database import engine, Base

from models.user import User
from models.schedule import Schedule
from models.committee import CommitteeCreate
from models.report import Report
from models.login_log import LoginLog

from routers.user import router as user_router
from routers.schedule import router as schedule_router
from routers.committee import router as committee_router
from routers.report import router as report_router
from routers.auth import router as auth_router


app = FastAPI(title="ARTC Backend API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CSPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)

        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self' data:; "
            "connect-src *; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )

        return response


app.add_middleware(CSPMiddleware)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend is running successfully"}

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(schedule_router, prefix="/schedules", tags=["Schedules"])
app.include_router(committee_router, prefix="/committee", tags=["Committee"])
app.include_router(report_router, prefix="/reports", tags=["Reports"])
