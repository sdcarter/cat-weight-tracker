from pydantic_settings import BaseSettings
from typing import Optional
import os
# Import the specific function from secrets module
from secrets import token_hex

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = 'postgresql://postgres:postgres@db:5432/cat_weight_tracker'
    
    # JWT settings
    SECRET_KEY: str = token_hex(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Feature flags
    REGISTRATION_ENABLED: bool = False
    
    # Override with environment variables if they exist and are not empty
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override with environment variables if they exist and are not empty
        if os.environ.get('DATABASE_URL'):
            self.DATABASE_URL = os.environ.get('DATABASE_URL')
        if os.environ.get('SECRET_KEY'):
            self.SECRET_KEY = os.environ.get('SECRET_KEY')
        if os.environ.get('ALGORITHM'):
            self.ALGORITHM = os.environ.get('ALGORITHM')
        if os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES') and os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES').strip():
            self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES'))
        if os.environ.get('REGISTRATION_ENABLED'):
            self.REGISTRATION_ENABLED = os.environ.get('REGISTRATION_ENABLED').lower() == 'true'
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Load environment variables
settings = Settings()