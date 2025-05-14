from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Cat schemas
class CatBase(BaseModel):
    name: str
    target_weight: float

class CatCreate(CatBase):
    pass

class Cat(CatBase):
    id: int

    class Config:
        orm_mode = True

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

    class Config:
        orm_mode = True

# Extended Cat schema with weight records
class CatWithRecords(Cat):
    weight_records: List[WeightRecord] = []

    class Config:
        orm_mode = True

# Plot data schema
class PlotData(BaseModel):
    cat_id: int
    dates: List[str]
    weights: List[float]
    target_weight: float
    name: str