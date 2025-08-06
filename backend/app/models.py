from datetime import date, datetime

from sqlalchemy import (Boolean, Column, Date, DateTime, Float, ForeignKey, Integer,
                        String, Index, CheckConstraint)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    cats = relationship("Cat", back_populates="owner", cascade="all, delete-orphan")

    # Constraints
    __table_args__ = (
        CheckConstraint('length(username) >= 3', name='username_min_length'),
        CheckConstraint('length(username) <= 50', name='username_max_length'),
        CheckConstraint("email LIKE '%@%.%'", name='email_format'),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    target_weight = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="cats")
    weight_records = relationship(
        "WeightRecord",
        back_populates="cat",
        cascade="all, delete-orphan",
        order_by="WeightRecord.date.desc()"
    )

    # Constraints
    __table_args__ = (
        CheckConstraint('length(name) >= 1', name='cat_name_min_length'),
        CheckConstraint('length(name) <= 100', name='cat_name_max_length'),
        CheckConstraint('target_weight > 0', name='target_weight_positive'),
        CheckConstraint('target_weight <= 50', name='target_weight_max'),
        Index('idx_cat_user_name', 'user_id', 'name'),  # Composite index for user's cats
    )

    def __repr__(self) -> str:
        return f"<Cat(id={self.id}, name='{self.name}', user_id={self.user_id})>"


class WeightRecord(Base):
    __tablename__ = "weight_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today, nullable=False, index=True)
    user_weight = Column(Float, nullable=False)
    combined_weight = Column(Float, nullable=False)
    cat_weight = Column(Float, nullable=False)
    cat_id = Column(Integer, ForeignKey("cats.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    cat = relationship("Cat", back_populates="weight_records")

    # Constraints
    __table_args__ = (
        CheckConstraint('user_weight > 0', name='user_weight_positive'),
        CheckConstraint('combined_weight > 0', name='combined_weight_positive'),
        CheckConstraint('cat_weight > 0', name='cat_weight_positive'),
        CheckConstraint('user_weight <= 1000', name='user_weight_max'),
        CheckConstraint('combined_weight <= 1000', name='combined_weight_max'),
        CheckConstraint('combined_weight > user_weight', name='combined_weight_greater'),
        CheckConstraint('date <= CURRENT_DATE', name='date_not_future'),
        Index('idx_weight_cat_date', 'cat_id', 'date'),  # Composite index for cat's weights by date
        Index('idx_weight_date_desc', 'date', postgresql_using='btree'),  # Index for date sorting
    )

    def __repr__(self) -> str:
        return f"<WeightRecord(id={self.id}, cat_weight={self.cat_weight}, date={self.date}, cat_id={self.cat_id})>"
