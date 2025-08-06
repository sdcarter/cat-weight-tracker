# Coding Standards - Cat Weight Tracker

## Overview
This document outlines coding standards for the Cat Weight Tracker project, emphasizing Material 3 design consistency, Biome linting compliance, and TypeScript best practices.

## Frontend Standards

### Material 3 Design System

#### Color Usage
```typescript
// ✅ DO: Use Material 3 color tokens
sx={{
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  borderColor: 'outline.variant',
}}

// ❌ DON'T: Use hardcoded colors
sx={{
  bgcolor: '#6750A4',
  color: '#FFFFFF',
}}
```

#### Typography Scale
```typescript
// ✅ DO: Use Material 3 typography variants
<Typography variant="headlineLarge">Main Title</Typography>
<Typography variant="bodyLarge">Body text</Typography>
<Typography variant="labelMedium">Button text</Typography>

// ❌ DON'T: Use custom font sizes
<Typography sx={{ fontSize: '24px' }}>Title</Typography>
```

#### Component Styling
```typescript
// ✅ DO: Use consistent border radius
<Card sx={{ borderRadius: 3 }}>           // Large: 24px
<Button sx={{ borderRadius: 3 }}>         // Large: 24px  
<TextField sx={{ 
  '& .MuiOutlinedInput-root': { 
    borderRadius: 2                       // Medium: 16px
  } 
}} />

// ❌ DON'T: Use inconsistent radius
<Card sx={{ borderRadius: '15px' }}>
```

#### Spacing System
```typescript
// ✅ DO: Use theme spacing (8px base unit)
<Box sx={{ p: 3, m: 2, gap: 1.5 }}>     // 24px, 16px, 12px

// ❌ DON'T: Use hardcoded spacing
<Box sx={{ padding: '24px', margin: '16px' }}>
```

### Component Architecture

#### Component Structure
```typescript
// ✅ DO: Follow consistent component structure
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button } from '@mui/material';
import { ComponentProps } from '../types/api';

interface Props extends ComponentProps {
  // Additional props
}

const MyComponent: React.FC<Props> = ({ prop1, prop2, ...rest }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<StateType>(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleAction = (): void => {
    // Handler logic
  };

  // Render
  return (
    <Box {...rest}>
      <Typography variant="h6">
        {t('component.title', 'Default Title')}
      </Typography>
      <Button onClick={handleAction}>
        {t('component.action', 'Action')}
      </Button>
    </Box>
  );
};

export default MyComponent;
```

#### Props Interface
```typescript
// ✅ DO: Define clear prop interfaces
interface CatCardProps {
  cat: Cat;
  selected?: boolean;
  onSelect: (cat: Cat) => void;
  onEdit: (cat: Cat) => void;
  onDelete: (catId: number) => void;
}

// ❌ DON'T: Use any or unclear props
interface CatCardProps {
  data: any;
  callbacks: any;
}
```

### State Management

#### useState Pattern
```typescript
// ✅ DO: Use typed state with clear initial values
const [cats, setCats] = useState<Cat[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// ❌ DON'T: Use untyped or unclear state
const [data, setData] = useState<any>(null);
const [flag, setFlag] = useState(false);
```

#### Custom Hooks
```typescript
// ✅ DO: Create reusable custom hooks
const useCatData = (catId: number) => {
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        setLoading(true);
        const data = await api.getCat(catId);
        setCat(data);
        setError(null);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    if (catId) {
      fetchCat();
    }
  }, [catId]);

  return { cat, loading, error };
};
```

### API Integration

#### Service Layer
```typescript
// ✅ DO: Use service layer pattern
class CatService {
  private client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
  });

  async getCats(): Promise<Cat[]> {
    const response = await this.client.get<Cat[]>('/cats/');
    return response.data;
  }

  async createCat(cat: CatCreate): Promise<Cat> {
    const response = await this.client.post<Cat>('/cats/', cat);
    return response.data;
  }
}

export const catService = new CatService();
```

#### Error Handling
```typescript
// ✅ DO: Consistent error handling
try {
  const cats = await catService.getCats();
  setCats(cats);
} catch (error) {
  const errorMessage = handleApiError(error);
  showToast('Error', `Failed to fetch cats: ${errorMessage}`);
  console.error('API Error:', error);
}

// ❌ DON'T: Silent failures or unclear errors
try {
  const cats = await catService.getCats();
  setCats(cats);
} catch (error) {
  // Silent failure
}
```

## Biome Standards

### Linting Rules Compliance

#### Variable Declarations
```typescript
// ✅ DO: Use const for immutable values
const API_URL = '/api';
const cats = await fetchCats();

// ✅ DO: Use let for mutable values
let currentIndex = 0;

// ❌ DON'T: Use var
var oldStyle = 'avoid';
```

#### Function Declarations
```typescript
// ✅ DO: Use arrow functions for consistency
const handleSubmit = async (data: FormData): Promise<void> => {
  // Function logic
};

// ✅ DO: Use function declarations for components
function MyComponent(): JSX.Element {
  return <div>Component</div>;
}
```

#### Import Organization
```typescript
// ✅ DO: Organize imports (Biome auto-organizes)
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Cat } from '../types/api';
import { api } from '../services/api';

// ❌ DON'T: Disorganized imports
import { Cat } from '../types/api';
import React from 'react';
import { Box } from '@mui/material';
```

### Formatting Standards

#### Code Formatting
```typescript
// ✅ DO: Follow Biome formatting (auto-formatted)
const config = {
  apiUrl: '/api',
  timeout: 5000,
  retries: 3,
};

const longFunctionCall = await someVeryLongFunctionName(
  parameter1,
  parameter2,
  parameter3,
);

// Object destructuring
const {
  name,
  targetWeight,
  userId,
} = cat;
```

#### JSX Formatting
```typescript
// ✅ DO: Consistent JSX formatting
<Card
  elevation={1}
  sx={{
    borderRadius: 3,
    p: 2,
    mb: 2,
  }}
>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      {cat.name}
    </Typography>
    <Button
      variant="contained"
      onClick={handleEdit}
      sx={{ mt: 1 }}
    >
      Edit
    </Button>
  </CardContent>
</Card>
```

## TypeScript Standards

### Type Definitions
```typescript
// ✅ DO: Define clear interfaces
interface Cat {
  id: number;
  name: string;
  targetWeight: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ✅ DO: Use union types appropriately
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ✅ DO: Use generic types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

### Type Safety
```typescript
// ✅ DO: Use type guards
const isCat = (obj: unknown): obj is Cat => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'targetWeight' in obj
  );
};

// ✅ DO: Use proper typing for event handlers
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  const { name, value } = event.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

## Backend Standards (Python)

### FastAPI Patterns
```python
# ✅ DO: Use proper dependency injection
@app.post("/cats/", response_model=schemas.Cat)
async def create_cat(
    cat: schemas.CatCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> models.Cat:
    return crud.create_cat(db=db, cat=cat, user_id=current_user.id)

# ✅ DO: Use proper error handling
@app.get("/cats/{cat_id}")
async def get_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = crud.get_cat(db, cat_id=cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return cat
```

### Database Models
```python
# ✅ DO: Use proper SQLAlchemy patterns
class Cat(Base):
    __tablename__ = "cats"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    target_weight = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="cats")
    weight_records = relationship("WeightRecord", back_populates="cat", cascade="all, delete-orphan")
```

## Testing Standards

### Frontend Testing
```typescript
// ✅ DO: Test component behavior, not implementation
test('should display cat information', () => {
  const cat = { id: 1, name: 'Fluffy', targetWeight: 5.0 };
  render(<CatCard cat={cat} onSelect={jest.fn()} />);
  
  expect(screen.getByText('Fluffy')).toBeInTheDocument();
  expect(screen.getByText('5.0 lbs')).toBeInTheDocument();
});

// ✅ DO: Test user interactions
test('should call onSelect when card is clicked', async () => {
  const onSelect = jest.fn();
  const cat = { id: 1, name: 'Fluffy', targetWeight: 5.0 };
  
  render(<CatCard cat={cat} onSelect={onSelect} />);
  
  await user.click(screen.getByRole('button', { name: /select/i }));
  expect(onSelect).toHaveBeenCalledWith(cat);
});
```

### Backend Testing
```python
# ✅ DO: Test API endpoints thoroughly
def test_create_cat(client: TestClient, db: Session):
    cat_data = {"name": "Test Cat", "target_weight": 5.0}
    response = client.post("/cats/", json=cat_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Cat"
    assert data["target_weight"] == 5.0
    assert "id" in data

def test_get_nonexistent_cat(client: TestClient):
    response = client.get("/cats/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
```

## Documentation Standards

### Code Comments
```typescript
// ✅ DO: Comment complex business logic
/**
 * Calculates the cat's weight by subtracting user weight from combined weight.
 * Ensures the result is never negative to handle measurement errors.
 */
const calculateCatWeight = (userWeight: number, combinedWeight: number): number => {
  return Math.max(0, combinedWeight - userWeight);
};

// ✅ DO: Document component props
interface CatFormProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Initial cat data for editing (null for new cat) */
  initialData?: Cat | null;
  /** Callback when form is submitted */
  onSubmit: (data: CatCreate) => Promise<void>;
  /** Callback when dialog is closed */
  onClose: () => void;
}
```

### README Updates
```markdown
# ✅ DO: Keep documentation current
## Tech Stack
- React 18 with TypeScript
- Material UI v6 (Material 3)
- Biome for linting and formatting
- Vite for building
- Vitest for testing

## Development
npm run dev          # Start development server
npm run check        # Run all Biome checks
npm run test         # Run tests
```

## Performance Standards

### Bundle Optimization
```typescript
// ✅ DO: Use lazy loading for large components
const CatChart = lazy(() => import('./CatChart'));

// ✅ DO: Memoize expensive calculations
const sortedCats = useMemo(() => 
  cats.sort((a, b) => a.name.localeCompare(b.name)),
  [cats]
);

// ✅ DO: Optimize re-renders
const CatCard = memo(({ cat, onSelect }: CatCardProps) => {
  // Component implementation
});
```

### Database Optimization
```python
# ✅ DO: Use efficient queries
cats = db.query(Cat).options(
    joinedload(Cat.weight_records)
).filter(Cat.user_id == user_id).all()

# ✅ DO: Add proper indexes
class Cat(Base):
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String(100), index=True)
```

These standards ensure consistency, maintainability, and performance across the Cat Weight Tracker codebase while leveraging the full power of Material 3 design system and Biome tooling.
