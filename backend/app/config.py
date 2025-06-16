import os
from secrets import token_hex

class Settings:
    """Application settings."""
    
    def __init__(self):
        # Database settings
        self.DATABASE_URL = os.environ.get('DATABASE_URL') or 'postgresql://postgres:postgres@db:5432/cat_weight_tracker'
        
        # JWT settings
        self.SECRET_KEY = os.environ.get('SECRET_KEY') or token_hex(32)
        self.ALGORITHM = os.environ.get('ALGORITHM') or 'HS256'
        
        # Handle integer conversion safely
        try:
            expire_minutes = os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES')
            self.ACCESS_TOKEN_EXPIRE_MINUTES = int(expire_minutes) if expire_minutes and expire_minutes.strip() else 30
        except (ValueError, TypeError):
            self.ACCESS_TOKEN_EXPIRE_MINUTES = 30
        
        # Handle boolean conversion safely
        registration_enabled = os.environ.get('REGISTRATION_ENABLED', '').lower()
        self.REGISTRATION_ENABLED = registration_enabled == 'true'

# Create a global instance
settings = Settings()