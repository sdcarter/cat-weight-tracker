import os
import warnings

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Filter out deprecation warnings using warnings module instead
warnings.filterwarnings(
    "ignore",
    category=PendingDeprecationWarning,
    module="starlette.formparsers")
warnings.filterwarnings(
    "ignore",
    category=DeprecationWarning,
    module="passlib.utils")
warnings.filterwarnings(
    "ignore",
    category=DeprecationWarning,
    message="Support for class-based `config` is deprecated")
warnings.filterwarnings(
    "ignore",
    category=DeprecationWarning,
    message="The 'app' shortcut is now deprecated")

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="session")
def db_engine():
    """Create a SQLAlchemy engine for testing."""
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

    # Remove test database file
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a SQLAlchemy session for testing."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Create a FastAPI TestClient with the test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
