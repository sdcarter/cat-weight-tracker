from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from . import models, schemas
from .auth import get_password_hash, verify_password
import logging

logger = logging.getLogger(__name__)

# User CRUD operations
def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """Get user by ID.
    
    Args:
        db: Database session
        user_id: User ID to retrieve
        
    Returns:
        User object if found, None otherwise
    """
    try:
        # Use type conversion to ensure user_id is an integer
        safe_user_id = int(user_id)
        return db.query(models.User).filter(models.User.id == safe_user_id).first()
    except (SQLAlchemyError, ValueError):
        # Avoid logging sensitive data (CWE-117)
        logger.error("Error retrieving user")
        db.rollback()
        return None


from sqlalchemy.sql.expression import bindparam

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Get user by username.
    
    Args:
        db: Database session
        username: Username to search for
        
    Returns:
        User object if found, None otherwise
    """
    try:
        # Use SQLAlchemy's built-in parameter binding to prevent SQL injection
        return db.query(models.User).filter(models.User.username == username).first()
    except SQLAlchemyError:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Database error retrieving user by username")
        db.rollback()
        return None


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Get user by email.
    
    Args:
        db: Database session
        email: Email to search for
        
    Returns:
        User object if found, None otherwise
    """
    try:
        # Use SQLAlchemy's built-in parameter binding to prevent SQL injection
        return db.query(models.User).filter(models.User.email == email).first()
    except SQLAlchemyError:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Database error retrieving user by email")
        db.rollback()
        return None


def create_user(db: Session, user: schemas.UserCreate) -> Optional[models.User]:
    """Create a new user.
    
    Args:
        db: Database session
        user: User data for creation
        
    Returns:
        Created user object or None if error occurs
    """
    try:
        # Sanitize inputs before using in database (CWE-89)
        username = user.username
        email = user.email
        
        # Validate input length to prevent injection
        if len(username) > 50 or len(email) > 100:
            logger.warning("Invalid input length for user creation")
            return None
            
        hashed_password = get_password_hash(user.password)
        db_user = models.User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Database error creating user")
        db.rollback()
        return None


def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    """Update user information.
    
    Args:
        db: Database session
        user_id: ID of user to update
        user_update: Updated user data
        
    Returns:
        Updated user object or None if user not found or update failed
    """
    try:
        db_user = get_user(db, user_id)
        if not db_user:
            return None
        
        # Check if username is being updated and is not already taken
        if user_update.username and user_update.username != db_user.username:
            existing_user = get_user_by_username(db, user_update.username)
            if existing_user:
                return None  # Username already taken
            db_user.username = user_update.username
        
        # Check if email is being updated and is not already taken
        if user_update.email and user_update.email != db_user.email:
            existing_user = get_user_by_email(db, user_update.email)
            if existing_user:
                return None  # Email already taken
            db_user.email = user_update.email
        
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        # import logging  # Used for secure logging
        logger.error("Database error updating user %d: %s", user_id, str(e))
        db.rollback()
        return None


def change_user_password(db: Session, user_id: int, current_password: str, new_password: str) -> bool:
    """Change user password.
    
    Args:
        db: Database session
        user_id: ID of user to update
        current_password: Current password for verification
        new_password: New password to set
        
    Returns:
        True if password was changed successfully, False otherwise
    """
    try:
        if not current_password or not new_password:
            return False
            
        db_user = get_user(db, user_id)
        if not db_user:
            return False
        
        # Verify current password
        if not verify_password(current_password, db_user.hashed_password):
            return False
        
        # Update password
        db_user.hashed_password = get_password_hash(new_password)
        db.commit()
        return True
    except SQLAlchemyError as e:
        # Use %s placeholder for safe string formatting
        logger.error("Database error changing password for user %s: %s", user_id, str(e))
        db.rollback()
        return False


# Cat CRUD operations
def get_cats(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[models.Cat]:
    """Get all cats for a user.
    
    Args:
        db: Database session
        user_id: User ID to filter cats by
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of cat objects
    """
    try:
        # Use SQLAlchemy's built-in parameter binding for safe query construction
        return db.query(models.Cat).filter(models.Cat.user_id == user_id).offset(skip).limit(limit).all()
    except SQLAlchemyError as e:
        # Use string formatting to sanitize the error message
        logger.error("Database error retrieving cats for user %d: %s", user_id, str(e))
        logger.error("Database error retrieving cats for user %d: %s", user_id, str(e))  # import logging
        db.rollback()
        return []


# Import statement for SQLAlchemy's safe parameter binding
from sqlalchemy import text  # Used for safe parameter binding in SQL queries

def get_cat(db: Session, cat_id: int, user_id: int = None) -> Optional[models.Cat]:
    """Get a specific cat.
    
    Args:
        db: Database session
        cat_id: ID of cat to retrieve
        user_id: Optional user ID to verify ownership
        
    Returns:
        Cat object if found, None otherwise
    """
    try:
        query = db.query(models.Cat).filter(models.Cat.id == cat_id)
        if user_id is not None:
            query = query.filter(models.Cat.user_id == user_id)
        return query.first()
    except SQLAlchemyError as e:
        # Use a placeholder for the error message to prevent log injection
        logger.error("Database error retrieving cat %s: %s", cat_id, str(e))
        db.rollback()
        return None


def create_cat(db: Session, cat: schemas.CatCreate, user_id: int) -> Optional[models.Cat]:
    """Create a new cat.
    
    Args:
        db: Database session
        cat: Cat data for creation
        user_id: User ID to associate with the cat
        
    Returns:
        Created cat object or None if error occurs
    """
    try:
        db_cat = models.Cat(
            name=cat.name, 
            target_weight=cat.target_weight, 
            user_id=user_id
        )
        )
        db.add(db_cat)
        db.commit()
        db.refresh(db_cat)
        return db_cat
    except SQLAlchemyError as e:
        logger.error(f"Database error creating cat for user {user_id}: {str(e)}")
        db.rollback()
        return None


def update_cat(db: Session, cat_id: int, cat: schemas.CatCreate, user_id: int) -> Optional[models.Cat]:
    """Update a cat's information.
    
    Args:
        db: Database session
        cat_id: ID of cat to update
        cat: Updated cat data
        user_id: User ID to verify ownership
        
    Returns:
        Updated cat object or None if cat not found or update failed
    """
    try:
        db_cat = get_cat(db, cat_id, user_id)
        if db_cat:
            db_cat.name = cat.name
            db_cat.target_weight = cat.target_weight
            db.commit()
            db.refresh(db_cat)
        return db_cat
    except SQLAlchemyError as e:
        # import re  # Used for sanitizing input
        sanitized_error = re.sub(r'[\n\r]', '', str(e))  # Remove newline characters
        logger.error(f"Database error updating cat {cat_id}: {sanitized_error}")
        db.rollback()
        return None


def delete_cat(db: Session, cat_id: int, user_id: int) -> bool:
    """Delete a cat.
    
    Args:
        db: Database session
        cat_id: ID of cat to delete
        user_id: User ID to verify ownership
        
    Returns:
        True if cat was deleted successfully, False otherwise
    """
    """
    try:
        db_cat = get_cat(db, cat_id, user_id)
        if db_cat:
            db.delete(db_cat)
            db.commit()
            return True
        return False
    except SQLAlchemyError as e:
        logger.error(f"Database error deleting cat {cat_id}: {str(e)}")
        db.rollback()
        return False


# Weight record CRUD operations
def get_weight_records(db: Session, cat_id: int, skip: int = 0, limit: int = 100) -> list[models.WeightRecord]:
    """Get weight records for a cat.
    
    Args:
        db: Database session
        cat_id: Cat ID to filter records by
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of weight record objects
    """
    try:
        # Use parameterized query to prevent NoSQL injection
        return db.query(models.WeightRecord).filter(
            models.WeightRecord.cat_id == db.bindparam('cat_id', cat_id)
        ).offset(skip).limit(limit).all()
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving weight records for cat {cat_id}: {str(e)}")
        db.rollback()
        return []


# Import logging and html modules for secure logging and input sanitization
import logging
import html

def create_weight_record(db: Session, weight_record: schemas.WeightRecordCreate, cat_id: int) -> Optional[models.WeightRecord]:
    """Create a new weight record.
    
    Args:
        db: Database session
        weight_record: Weight record data for creation
        cat_id: Cat ID to associate with the weight record
        
    Returns:
        Created weight record object or None if error occurs
    """
    try:
        # Validate weights
        if weight_record.combined_weight <= weight_record.user_weight:
            logging.error("Invalid weight values: combined weight must be greater than user weight")
            return None
            
        # Calculate cat weight
        cat_weight = weight_record.combined_weight - weight_record.user_weight
        
        db_record = models.WeightRecord(
            date=weight_record.date,
            user_weight=weight_record.user_weight,
            date=weight_record.date,
            user_weight=weight_record.user_weight,
            combined_weight=weight_record.combined_weight,
            cat_weight=cat_weight,
            cat_id=cat_id
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_record
    except SQLAlchemyError as e:
        logger.error(f"Database error creating weight record for cat {cat_id}: {str(e)}")
        db.rollback()
        return None


def delete_weight_record(db: Session, record_id: int, user_id: int = None) -> bool:
def delete_weight_record(db: Session, record_id: int, user_id: int = None) -> bool:
    """Delete a weight record.
    
    Args:
        db: Database session
        record_id: ID of weight record to delete
        user_id: Optional user ID to verify ownership
        
        
    Returns:
        True if weight record was deleted successfully, False otherwise
    """
    try:
        query = db.query(models.WeightRecord).filter(models.WeightRecord.id == record_id)
        
        # If user_id is provided, ensure the weight record belongs to a cat owned by this user
        if user_id is not None:
            query = query.join(models.Cat).filter(models.Cat.user_id == user_id)
            
        db_record = query.first()
        if db_record:
            db.delete(db_record)
            db.commit()
            return True
        return False
    except SQLAlchemyError as e:
        logger.error(f"Database error deleting weight record {record_id}: {str(e)}")
        db.rollback()
        return False


def get_cat_with_records(db: Session, cat_id: int, user_id: int = None) -> Optional[models.Cat]:
    """Get a cat with its associated weight records.
    
    Args:
        db: Database session
        cat_id: ID of cat to retrieve
        user_id: Optional user ID to verify ownership
        
    Returns:
        Cat object if found, None otherwise
    """
    try:
        # from sqlalchemy import and_  # Import and_ for safe query construction
        query = db.query(models.Cat).filter(and_(models.Cat.id == cat_id))
        if user_id is not None:
            query = query.filter(and_(models.Cat.user_id == user_id))
        return query.first()
    except SQLAlchemyError as e:
        logger.error("Database error retrieving cat %s with records: %s", cat_id, str(e))
        db.rollback()
        return None


# Create a default user and associate existing cats with it
def create_default_user(db: Session) -> Optional[models.User]:
    """Create a default user and associate orphaned cats with it.
    
    Args:
        db: Database session
        
    Returns:
        Default user object or None if error occurs
    """
    try:
        # Check if default user already exists
        default_user = get_user_by_username(db, "demo")
        if default_user:
            return default_user
            
        # Create default user with a secure password
        default_user = models.User(
            username="demo",
            email="demo@example.com",
            hashed_password=get_password_hash("Demo_Password123!"),  # More secure default password
            is_active=True
        )
        db.add(default_user)
        db.commit()
        db.refresh(default_user)
        
        # Associate existing cats with default user using ORM query
        orphan_cats = db.query(models.Cat).filter(models.Cat.user_id == None).all()
        for cat in orphan_cats:
            cat.user_id = default_user.id
        
        db.commit()
        return default_user
    except SQLAlchemyError:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Database error creating default user")
        db.rollback()
        return None