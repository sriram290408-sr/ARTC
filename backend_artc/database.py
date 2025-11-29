from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = "postgresql://postgres:AcademyRootPassword@localhost:5432/Artc"

engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()