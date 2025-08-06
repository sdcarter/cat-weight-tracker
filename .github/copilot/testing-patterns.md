# Testing Patterns

This file provides examples of testing patterns used in the Cat Weight Tracker application to help GitHub Copilot generate consistent test code.

## Backend Testing Patterns (pytest)

### FastAPI Endpoint Testing

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.user import User
from app.models.cat import Cat
from tests.utils import create_test_user, create_test_cat, get_auth_headers

client = TestClient(app)

class TestCatEndpoints:
    """Test cat-related API endpoints."""

    def test_create_cat_success(self, db: Session, test_user: User):
        """Test successful cat creation."""
        cat_data = {
            "name": "Fluffy",
            "breed": "Persian",
            "birth_date": "2020-01-15T00:00:00"
        }
        
        response = client.post(
            "/cats/",
            json=cat_data,
            headers=get_auth_headers(test_user)
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == cat_data["name"]
        assert data["breed"] == cat_data["breed"]
        assert data["owner_id"] == test_user.id

    def test_create_cat_unauthorized(self, db: Session):
        """Test cat creation without authentication."""
        cat_data = {"name": "Fluffy", "breed": "Persian"}
        
        response = client.post("/cats/", json=cat_data)
        
        assert response.status_code == 401

    def test_get_user_cats(self, db: Session, test_user: User):
        """Test retrieving user's cats."""
        # Create test cats
        cat1 = create_test_cat(db, owner_id=test_user.id, name="Cat1")
        cat2 = create_test_cat(db, owner_id=test_user.id, name="Cat2")
        
        response = client.get(
            "/cats/",
            headers=get_auth_headers(test_user)
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        cat_names = [cat["name"] for cat in data]
        assert "Cat1" in cat_names
        assert "Cat2" in cat_names

    def test_update_cat_success(self, db: Session, test_user: User):
        """Test successful cat update."""
        cat = create_test_cat(db, owner_id=test_user.id)
        update_data = {"name": "Updated Name"}
        
        response = client.put(
            f"/cats/{cat.id}",
            json=update_data,
            headers=get_auth_headers(test_user)
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"

    def test_delete_cat_not_owner(self, db: Session, test_user: User):
        """Test deleting cat that doesn't belong to user."""
        other_user = create_test_user(db, email="other@example.com")
        cat = create_test_cat(db, owner_id=other_user.id)
        
        response = client.delete(
            f"/cats/{cat.id}",
            headers=get_auth_headers(test_user)
        )
        
        assert response.status_code == 404
```

### Database Model Testing

```python
import pytest
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.cat import Cat
from app.models.weight_entry import WeightEntry
from tests.utils import create_test_user

class TestCatModel:
    """Test Cat model functionality."""

    def test_create_cat(self, db: Session):
        """Test creating a cat model."""
        user = create_test_user(db)
        
        cat = Cat(
            name="Test Cat",
            breed="Tabby",
            birth_date=datetime(2020, 1, 1),
            owner_id=user.id
        )
        db.add(cat)
        db.commit()
        db.refresh(cat)
        
        assert cat.id is not None
        assert cat.name == "Test Cat"
        assert cat.breed == "Tabby"
        assert cat.owner_id == user.id
        assert cat.created_at is not None

    def test_cat_weight_entries_relationship(self, db: Session):
        """Test cat to weight entries relationship."""
        user = create_test_user(db)
        cat = Cat(name="Test Cat", owner_id=user.id)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        
        # Add weight entries
        weight1 = WeightEntry(weight=10.5, date_recorded=datetime.now(), cat_id=cat.id)
        weight2 = WeightEntry(weight=11.0, date_recorded=datetime.now(), cat_id=cat.id)
        db.add_all([weight1, weight2])
        db.commit()
        
        # Test relationship
        assert len(cat.weight_entries) == 2
        assert weight1 in cat.weight_entries
        assert weight2 in cat.weight_entries

    def test_cat_cascade_delete(self, db: Session):
        """Test that deleting a cat deletes associated weight entries."""
        user = create_test_user(db)
        cat = Cat(name="Test Cat", owner_id=user.id)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        
        # Add weight entry
        weight = WeightEntry(weight=10.5, date_recorded=datetime.now(), cat_id=cat.id)
        db.add(weight)
        db.commit()
        
        # Delete cat
        db.delete(cat)
        db.commit()
        
        # Check that weight entry is also deleted
        remaining_weights = db.query(WeightEntry).filter(WeightEntry.cat_id == cat.id).all()
        assert len(remaining_weights) == 0
```

### CRUD Testing

```python
import pytest
from sqlalchemy.orm import Session

from app.crud.cat import cat_crud
from app.schemas.cat import CatCreate, CatUpdate
from tests.utils import create_test_user

class TestCatCRUD:
    """Test Cat CRUD operations."""

    def test_create_cat(self, db: Session):
        """Test creating a cat via CRUD."""
        user = create_test_user(db)
        cat_data = CatCreate(name="Test Cat", breed="Tabby")
        
        cat = cat_crud.create_with_owner(db=db, obj_in=cat_data, owner_id=user.id)
        
        assert cat.name == "Test Cat"
        assert cat.breed == "Tabby"
        assert cat.owner_id == user.id

    def test_get_by_owner(self, db: Session):
        """Test getting cats by owner."""
        user = create_test_user(db)
        cat_data1 = CatCreate(name="Cat 1")
        cat_data2 = CatCreate(name="Cat 2")
        
        cat_crud.create_with_owner(db=db, obj_in=cat_data1, owner_id=user.id)
        cat_crud.create_with_owner(db=db, obj_in=cat_data2, owner_id=user.id)
        
        cats = cat_crud.get_by_owner(db=db, owner_id=user.id)
        
        assert len(cats) == 2
        cat_names = [cat.name for cat in cats]
        assert "Cat 1" in cat_names
        assert "Cat 2" in cat_names

    def test_update_cat(self, db: Session):
        """Test updating a cat."""
        user = create_test_user(db)
        cat_data = CatCreate(name="Original Name")
        cat = cat_crud.create_with_owner(db=db, obj_in=cat_data, owner_id=user.id)
        
        update_data = CatUpdate(name="Updated Name")
        updated_cat = cat_crud.update(db=db, db_obj=cat, obj_in=update_data)
        
        assert updated_cat.name == "Updated Name"
        assert updated_cat.id == cat.id
```

## Frontend Testing Patterns (Vitest + React Testing Library)

### Component Testing

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CatCard } from '../CatCard';
import { AuthProvider } from '../../contexts/AuthContext';
import { Cat } from '../../types/api';

const mockCat: Cat = {
  id: 1,
  name: 'Fluffy',
  breed: 'Persian',
  birth_date: '2020-01-15T00:00:00Z',
  owner_id: 1,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CatCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cat information correctly', () => {
    renderWithProviders(
      <CatCard cat={mockCat} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Fluffy')).toBeInTheDocument();
    expect(screen.getByText('Persian')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    renderWithProviders(
      <CatCard cat={mockCat} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockCat);
  });

  it('shows confirmation dialog when delete button is clicked', async () => {
    renderWithProviders(
      <CatCard cat={mockCat} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('calls onDelete when deletion is confirmed', async () => {
    renderWithProviders(
      <CatCard cat={mockCat} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockCat.id);
    });
  });
});
```

### Hook Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAsync<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful async operation', async () => {
    const { result } = renderHook(() => useAsync<string>());
    const mockAsyncFunction = vi.fn().mockResolvedValue('success');

    await act(async () => {
      await result.current.execute(mockAsyncFunction);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockAsyncFunction).toHaveBeenCalledOnce();
  });

  it('should handle async operation error', async () => {
    const { result } = renderHook(() => useAsync<string>());
    const mockAsyncFunction = vi.fn().mockRejectedValue(new Error('Test error'));

    await act(async () => {
      await result.current.execute(mockAsyncFunction);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Test error');
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useAsync<string>());

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

### API Service Testing

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { catApi } from '../catApi';
import { Cat, CatCreate } from '../../types/api';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('catApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCats', () => {
    it('should fetch cats successfully', async () => {
      const mockCats: Cat[] = [
        {
          id: 1,
          name: 'Fluffy',
          breed: 'Persian',
          birth_date: '2020-01-15T00:00:00Z',
          owner_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockCats });

      const result = await catApi.getCats();

      expect(result).toEqual(mockCats);
      expect(mockedAxios.get).toHaveBeenCalledWith('/cats');
    });

    it('should handle API error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(catApi.getCats()).rejects.toThrow('API Error');
    });
  });

  describe('createCat', () => {
    it('should create cat successfully', async () => {
      const catData: CatCreate = {
        name: 'New Cat',
        breed: 'Tabby',
      };

      const mockCreatedCat: Cat = {
        id: 1,
        ...catData,
        birth_date: null,
        owner_id: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: mockCreatedCat });

      const result = await catApi.createCat(catData);

      expect(result).toEqual(mockCreatedCat);
      expect(mockedAxios.post).toHaveBeenCalledWith('/cats', catData);
    });
  });
});
```

## Test Utilities

```typescript
// tests/utils.ts
import { User } from '../src/types/api';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  is_active: true,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides,
});

export const createMockCat = (overrides: Partial<Cat> = {}): Cat => ({
  id: 1,
  name: 'Test Cat',
  breed: 'Tabby',
  birth_date: '2020-01-15T00:00:00Z',
  owner_id: 1,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides,
});
```

```python
# tests/utils.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.cat import Cat
from app.core.security import create_access_token

def create_test_user(db: Session, email: str = "test@example.com") -> User:
    """Create a test user."""
    user = User(
        email=email,
        username=email.split("@")[0],
        hashed_password="fake_hashed_password"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_test_cat(db: Session, owner_id: int, name: str = "Test Cat") -> Cat:
    """Create a test cat."""
    cat = Cat(name=name, owner_id=owner_id)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

def get_auth_headers(user: User) -> dict:
    """Get authentication headers for a user."""
    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}
```

## Testing Best Practices

1. **Use descriptive test names** that explain what is being tested
2. **Follow the AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies** (APIs, databases, etc.)
4. **Test both success and error cases**
5. **Use factories/utilities** for creating test data
6. **Clean up after tests** (database transactions, mocks)
7. **Test user interactions** not implementation details
8. **Use proper assertions** that provide meaningful error messages
