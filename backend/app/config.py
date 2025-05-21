from pydantic import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/cat_weight_tracker"
    
    # JWT settings
    SECRET_KEY: str = "YOUR_SECRET_KEY_HERE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Feature flags
    REGISTRATION_ENABLED: bool = False  # Default to disabled
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Load environment variables
settings = Settings()