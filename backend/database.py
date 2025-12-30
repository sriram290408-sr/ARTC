from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import DB_URL

engine = create_engine(DB_URL,pool_pre_ping=True,pool_size=5,max_overflow=10)

SessionLocal = sessionmaker(bind=engine,autoflush=False,autocommit=False)

Base = declarative_base()
