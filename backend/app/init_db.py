import logging

from passlib.context import CryptContext

from .database import engine
from .models import Base, Cat, User

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)


def init_db():
    """Initialize the database with tables and default data."""
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables created successfully")

        # Create a session
        from sqlalchemy.orm import sessionmaker
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        # Check if default user exists
        default_user = db.query(User).filter(User.username == "demo").first()

        if not default_user:
            # Create default user
            default_user = User(
                username="demo",
                email="demo@example.com",
                hashed_password=get_password_hash("password"),
                is_active=True
            )
            db.add(default_user)
            db.commit()
            db.refresh(default_user)
            logging.info("Default user created")

            # Create a sample cat
            sample_cat = Cat(
                name="Sample Cat",
                target_weight=5.0,
                user_id=default_user.id
            )
            db.add(sample_cat)
            db.commit()
            logging.info("Sample cat created")

        db.close()
        return True
    except Exception as e:
        logging.error(f"Error initializing database: {e}")
        return False
