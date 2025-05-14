from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date

class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    target_weight = Column(Float)
    
    # Relationship with WeightRecord
    weight_records = relationship("WeightRecord", back_populates="cat", cascade="all, delete-orphan")

class WeightRecord(Base):
    __tablename__ = "weight_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today)
    user_weight = Column(Float)
    combined_weight = Column(Float)
    cat_weight = Column(Float)
    cat_id = Column(Integer, ForeignKey("cats.id"))
    
    # Relationship with Cat
    cat = relationship("Cat", back_populates="weight_records")