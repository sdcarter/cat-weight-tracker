from pydantic_settings import BaseSettings
from typing import Optional
import os
# Import the specific function from secrets module
from secrets import token_hex

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.environ.get('DATABASE_URL') or 'postgresql://postgres:postgres@db:5432/cat_weight_tracker'
    
    # JWT settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY") or token_hex(32)
    ALGORITHM: str = os.environ.get("ALGORITHM") or "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES") or "30")
    
    # Feature flags
    REGISTRATION_ENABLED: bool = (os.environ.get("REGISTRATION_ENABLED") or "false").lower() == "true"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Load environment variables
settings = Settings()