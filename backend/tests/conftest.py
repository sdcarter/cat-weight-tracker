import os
import sys
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.auth import create_access_token, get_password_hash
from app.database import Base, get_db
from app.main import app
from app.models import User

# Add the parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Test database URL - use PostgreSQL in CI, SQLite locally
if os.environ.get("CI"):
    DB_USER = os.environ.get("DB_USER", "postgres")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "postgres")
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_PORT = os.environ.get("DB_PORT", "5432")
    DB_NAME = os.environ.get("DB_NAME", "cat_weight_tracker_test")
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="function")
def test_db():
    # Create the database engine
    if os.environ.get("CI"):
        # PostgreSQL in CI
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
    else:
        # SQLite locally
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create the tables
    Base.metadata.create_all(bind=engine)

    # Create a session
    db = TestingSessionLocal()

    # Create test user
    test_user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        is_active=True
    )
    db.add(test_user)

    # Create demo user (needed for some tests)
    demo_user = User(
        username="demo",
        email="demo@example.com",
        hashed_password=get_password_hash("password"),
        is_active=True
    )
    db.add(demo_user)

    db.commit()
    db.refresh(test_user)

    try:
        yield db
    finally:
        db.close()
        # Drop all tables after the test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_token():
    access_token = create_access_token(
        data={"sub": "testuser"},
        expires_delta=timedelta(minutes=30)
    )
    return access_token


@pytest.fixture(scope="function")
def client(test_db, test_token):
    # Override the get_db dependency to use the test database
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        # Add authentication header to all requests
        c.headers = {
            "Authorization": f"Bearer {test_token}"
        }
        yield c

    # Remove the override after the test
    app.dependency_overrides = {}


def create_test_user(db):
    """Create a test user for testing purposes."""
    test_user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    return test_user
