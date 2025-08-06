# Common Code Patterns

This file provides examples of common code patterns used in the Cat Weight Tracker application to help GitHub Copilot generate consistent code.

## FastAPI Endpoint Example

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.cat import CatCreate, CatResponse, CatUpdate
from app.crud.cat import cat_crud
from app.core.auth import get_current_user

router = APIRouter(prefix="/cats", tags=["cats"])

@router.post("/", response_model=CatResponse, status_code=status.HTTP_201_CREATED)
def create_cat(
    cat_data: CatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CatResponse:
    """Create a new cat for the current user."""
    try:
        cat = cat_crud.create_with_owner(db=db, obj_in=cat_data, owner_id=current_user.id)
        return cat
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create cat: {str(e)}"
        )

@router.get("/", response_model=List[CatResponse])
def get_user_cats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CatResponse]:
    """Get all cats for the current user."""
    return cat_crud.get_by_owner(db=db, owner_id=current_user.id)
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { Cat, WeightEntry } from '../types/api';
import { catApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CatWeightChartProps {
  catId: string;
  className?: string;
}

export const CatWeightChart: React.FC<CatWeightChartProps> = ({ 
  catId, 
  className = '' 
}) => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWeightEntries = async () => {
      if (!user || !catId) return;
      
      try {
        setLoading(true);
        setError(null);
        const entries = await catApi.getWeightEntries(catId);
        setWeightEntries(entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weight entries');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightEntries();
  }, [catId, user]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
      {/* Chart implementation */}
    </div>
  );
};
```

## Database Model Example

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    breed = Column(String(100), nullable=True)
    birth_date = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="cats")
    weight_entries = relationship("WeightEntry", back_populates="cat", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Cat(id={self.id}, name='{self.name}', owner_id={self.owner_id})>"

class WeightEntry(Base):
    __tablename__ = "weight_entries"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float, nullable=False)
    date_recorded = Column(DateTime, nullable=False)
    notes = Column(String(500), nullable=True)
    cat_id = Column(Integer, ForeignKey("cats.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    cat = relationship("Cat", back_populates="weight_entries")

    def __repr__(self) -> str:
        return f"<WeightEntry(id={self.id}, weight={self.weight}, cat_id={self.cat_id})>"
```

## Pydantic Schema Example

```python
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List

class CatBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    breed: Optional[str] = Field(None, max_length=100)
    birth_date: Optional[datetime] = None

class CatCreate(CatBase):
    pass

class CatUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    breed: Optional[str] = Field(None, max_length=100)
    birth_date: Optional[datetime] = None

class CatResponse(CatBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WeightEntryCreate(BaseModel):
    weight: float = Field(..., gt=0, description="Weight in pounds or kilograms")
    date_recorded: datetime
    notes: Optional[str] = Field(None, max_length=500)

class WeightEntryResponse(WeightEntryCreate):
    id: int
    cat_id: int
    created_at: datetime

    class Config:
        from_attributes = True
```

## API Service Example (Frontend)

```typescript
import axios, { AxiosResponse } from 'axios';
import { Cat, CatCreate, CatUpdate, WeightEntry, WeightEntryCreate } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const catApi = {
  // Cat operations
  getCats: async (): Promise<Cat[]> => {
    const response: AxiosResponse<Cat[]> = await apiClient.get('/cats');
    return response.data;
  },

  createCat: async (catData: CatCreate): Promise<Cat> => {
    const response: AxiosResponse<Cat> = await apiClient.post('/cats', catData);
    return response.data;
  },

  updateCat: async (catId: string, catData: CatUpdate): Promise<Cat> => {
    const response: AxiosResponse<Cat> = await apiClient.put(`/cats/${catId}`, catData);
    return response.data;
  },

  deleteCat: async (catId: string): Promise<void> => {
    await apiClient.delete(`/cats/${catId}`);
  },

  // Weight entry operations
  getWeightEntries: async (catId: string): Promise<WeightEntry[]> => {
    const response: AxiosResponse<WeightEntry[]> = await apiClient.get(`/cats/${catId}/weights`);
    return response.data;
  },

  addWeightEntry: async (catId: string, weightData: WeightEntryCreate): Promise<WeightEntry> => {
    const response: AxiosResponse<WeightEntry> = await apiClient.post(
      `/cats/${catId}/weights`, 
      weightData
    );
    return response.data;
  },
};
```

## Error Handling Pattern

```typescript
// Frontend error handling
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status >= 500) {
      return 'Server error. Please try again later.';
    }
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};
```

## Custom Hook Example

```typescript
import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errorHandling';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (asyncFunction: () => Promise<T>) => Promise<void>;
  reset: () => void;
}

export const useAsync = <T>(): UseAsyncState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};
```
