from datetime import date as DateType
from typing import List, Optional
import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

# User schemas

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username must be 3-50 characters")
    email: str = Field(..., max_length=255, description="Valid email address")
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128, description="Password must be at least 8 characters")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1, max_length=128)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if v is not None and not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v is not None:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, v):
                raise ValueError('Invalid email format')
            return v.lower()
        return v


class UserPasswordChange(BaseModel):
    current_password: str = Field(..., min_length=1, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class User(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None

# Cat schemas

class CatBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Cat name must be 1-100 characters")
    target_weight: float = Field(..., gt=0, le=50, description="Target weight must be between 0 and 50 pounds/kg")
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        # Remove extra whitespace and validate
        v = v.strip()
        if not v:
            raise ValueError('Cat name cannot be empty')
        if len(v) > 100:
            raise ValueError('Cat name too long')
        return v


class CatCreate(CatBase):
    pass


class Cat(CatBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)

# Weight record schemas

class WeightRecordBase(BaseModel):
    date: DateType = Field(..., description="Date of weight measurement")
    user_weight: float = Field(..., gt=0, le=1000, description="User weight must be between 0 and 1000 pounds/kg")
    combined_weight: float = Field(..., gt=0, le=1000, description="Combined weight must be between 0 and 1000 pounds/kg")
    
    @field_validator('combined_weight', 'user_weight')
    @classmethod
    def validate_weights(cls, v, info):
        if v <= 0:
            raise ValueError(f'{info.field_name} must be greater than 0')
        if v > 1000:
            raise ValueError(f'{info.field_name} must be less than 1000')
        return round(v, 2)  # Round to 2 decimal places
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v):
        from datetime import date as date_type
        if v > date_type.today():
            raise ValueError('Date cannot be in the future')
        return v


class WeightRecordCreate(WeightRecordBase):
    pass


class WeightRecord(WeightRecordBase):
    id: int
    cat_weight: float
    cat_id: int

    model_config = ConfigDict(from_attributes=True)

# Extended Cat schema with weight records

class CatWithRecords(Cat):
    weight_records: List[WeightRecord] = []

    model_config = ConfigDict(from_attributes=True)

# Extended User schema with cats

class UserWithCats(User):
    cats: List[Cat] = []

    model_config = ConfigDict(from_attributes=True)

# Plot data schema

class PlotData(BaseModel):
    cat_id: int
    dates: List[str]
    weights: List[float]
    target_weight: float
    name: str
