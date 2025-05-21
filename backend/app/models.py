from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationship with Cat
    cats = relationship("Cat", back_populates="owner", cascade="all, delete-orphan")

class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    target_weight = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    owner = relationship("User", back_populates="cats")
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