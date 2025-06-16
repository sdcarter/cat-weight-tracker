from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging
from . import models, schemas, database
from .config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Security configuration from settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 with Password flow
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash.
    
    Args:
        plain_password: The plain text password
        hashed_password: The hashed password to compare against
        
    Returns:
        True if the password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error("Error verifying password")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password for storage.
    
    Args:
        password: The plain text password to hash
        
    Returns:
        The hashed password
    """
    return pwd_context.hash(password)

def get_user(db: Session, username: str) -> Optional[models.User]:
    """Get a user by username.
    
    Args:
        db: Database session
        username: Username to search for
        
    Returns:
        User object if found, None otherwise
    """
    try:
        return db.query(models.User).filter(models.User.username == username).first()
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving user by username: {str(e)}")
        db.rollback()
        return None

def authenticate_user(db: Session, username: str, password: str) -> Union[models.User, bool]:
    """Authenticate a user with username and password.
    
    Args:
        db: Database session
        username: Username to authenticate
        password: Password to verify
        
    Returns:
        User object if authentication succeeds, False otherwise
    """
    if not username or not password:
        return False
        
    try:
        user = get_user(db, username)
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token.
    
    Args:
        data: Data to encode in the token
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)) -> models.User:
    """Get the current user from a JWT token.
    
    Args:
        token: JWT token from request
        db: Database session
        
    Returns:
        User object if token is valid
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        logger.warning("Missing authentication token")
        raise credentials_exception
        
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            logger.warning("Token missing subject claim")
            raise credentials_exception
            
        # Validate token expiration
        exp = payload.get("exp")
        if not exp or datetime.utcnow().timestamp() > exp:
            logger.warning("Token expired")
            raise credentials_exception
            
        token_data = schemas.TokenData(username=username)
    except JWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise credentials_exception
    
    user = get_user(db, username=token_data.username)
    if user is None:
        logger.warning(f"User from token not found: {token_data.username}")
        raise credentials_exception
    return user

async def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Get the current active user.
    
    Args:
        current_user: User object from get_current_user dependency
        
    Returns:
        User object if user is active
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        logger.warning(f"Inactive user attempted access: {current_user.username}")
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user