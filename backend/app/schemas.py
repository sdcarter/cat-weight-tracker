from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional, Union

# User schemas
class UserBase(BaseModel):
    username: str
    email: str  # Changed from EmailStr to str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str

class User(UserBase):
    id: int
    is_active: bool

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Cat schemas
class CatBase(BaseModel):
    name: str
    target_weight: float

class CatCreate(CatBase):
    pass

class Cat(CatBase):
    id: int
    user_id: int

    model_config = {"from_attributes": True}

# Weight record schemas
class WeightRecordBase(BaseModel):
    date: date
    user_weight: float
    combined_weight: float

class WeightRecordCreate(WeightRecordBase):
    pass

class WeightRecord(WeightRecordBase):
    id: int
    cat_weight: float
    cat_id: int

    model_config = {"from_attributes": True}

# Extended Cat schema with weight records
class CatWithRecords(Cat):
    weight_records: List[WeightRecord] = []

    model_config = {"from_attributes": True}

# Extended User schema with cats
class UserWithCats(User):
    cats: List[Cat] = []

    model_config = {"from_attributes": True}

# Plot data schema
class PlotData(BaseModel):
    cat_id: int
    dates: List[str]
    weights: List[float]
    target_weight: float
    name: str