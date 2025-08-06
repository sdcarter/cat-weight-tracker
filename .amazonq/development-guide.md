# Development Guide - Cat Weight Tracker

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development)
- Python 3.11+ (for local development)

### Setup
```bash
# Clone and start
git clone <repository>
cd cat-weight-tracker
cp .env.example .env
docker-compose up -d

# Access application
Frontend: http://localhost:80
Backend API: http://localhost:4000
API Docs: http://localhost:4000/docs
```

## Material 3 Development

### Theme Customization
```typescript
// src/theme/material3Theme.ts
export const material3Theme = createTheme({
  palette: {
    primary: { main: '#6750A4' },    // Material 3 primary
    secondary: { main: '#625B71' },   // Material 3 secondary
    // ... other colors
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Material 3 typography scale
  },
  shape: { borderRadius: 12 },        // Medium corner radius
});
```

### Component Patterns
```typescript
// Use Material 3 components consistently
import { Card, CardContent, Button, TextField } from '@mui/material';

const MyComponent = () => (
  <Card sx={{ borderRadius: 3 }}>     {/* Large corner radius */}
    <CardContent>
      <TextField 
        variant="outlined"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
      <Button 
        variant="contained" 
        sx={{ borderRadius: 3 }}        {/* Button corner radius */}
      >
        Action
      </Button>
    </CardContent>
  </Card>
);
```

### Color System
```typescript
// Use Material 3 color tokens
sx={{
  bgcolor: 'primary.main',           // Primary color
  color: 'primary.contrastText',     // Contrast text
  borderColor: 'outline.main',       // Outline color
}}
```

## Biome Configuration

### Linting Rules
```json
// biome.json - Key rules
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": "error",
        "noUndeclaredVariables": "error"
      },
      "style": {
        "noVar": "error",
        "useConst": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noArrayIndexKey": "warn"
      }
    }
  }
}
```

### Commands
```bash
# Linting
npm run lint              # Check for issues
npm run lint:fix          # Fix auto-fixable issues

# Formatting
npm run format            # Format all files
npm run format:check      # Check formatting

# Combined
npm run check             # Run all checks
npm run check:fix         # Fix all auto-fixable issues
```

## Component Development

### Material 3 Form Pattern
```typescript
import { TextField, Button, Box } from '@mui/material';

const FormComponent = () => {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Input Label"
        variant="outlined"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,  // Small corner radius for inputs
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ borderRadius: 3, alignSelf: 'flex-end' }}
      >
        Submit
      </Button>
    </Box>
  );
};
```

### Card Layout Pattern
```typescript
import { Card, CardContent, Typography, Box } from '@mui/material';

const CardComponent = () => (
  <Card elevation={1} sx={{ borderRadius: 3 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Title</Typography>
        <Button variant="outlined" size="small">Action</Button>
      </Box>
      {/* Content */}
    </CardContent>
  </Card>
);
```

## API Integration

### Service Layer Pattern
```typescript
// src/services/api.ts
class ApiService {
  private client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
  });

  async getCats(): Promise<Cat[]> {
    const response = await this.client.get<Cat[]>('/cats/');
    return response.data;
  }
}

export const api = new ApiService();
```

### Error Handling
```typescript
try {
  const cats = await api.getCats();
  setCats(cats);
} catch (error) {
  showToast('Error', `Failed to fetch cats. ${handleApiError(error)}`);
}
```

## State Management

### Context Pattern
```typescript
const CatContext = createContext<{
  cats: Cat[];
  selectedCat: Cat | null;
  selectCat: (cat: Cat) => void;
}>({} as any);

export const useCats = () => useContext(CatContext);
```

### Custom Hooks
```typescript
const useCatData = (catId: number) => {
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const data = await api.getCat(catId);
        setCat(data);
      } catch (error) {
        console.error('Failed to fetch cat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [catId]);

  return { cat, loading };
};
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { material3Theme } from '../theme/material3Theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={material3Theme}>
      {component}
    </ThemeProvider>
  );
};

test('renders cat form', () => {
  renderWithTheme(<CatForm onSubmit={jest.fn()} onClose={jest.fn()} />);
  expect(screen.getByLabelText(/cat name/i)).toBeInTheDocument();
});
```

### API Testing
```typescript
import { api } from '../services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('fetches cats successfully', async () => {
  const cats = [{ id: 1, name: 'Fluffy', target_weight: 5.0 }];
  mockedAxios.get.mockResolvedValue({ data: cats });

  const result = await api.getCats();
  expect(result).toEqual(cats);
});
```

## Backend Development

### FastAPI Patterns
```python
# Dependency injection
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Authentication logic
    return user

# Route with validation
@app.post("/cats/", response_model=schemas.Cat)
async def create_cat(
    cat: schemas.CatCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_cat(db=db, cat=cat, user_id=current_user.id)
```

### Database Models
```python
class Cat(Base):
    __tablename__ = "cats"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    target_weight = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="cats")
    weight_records = relationship("WeightRecord", back_populates="cat")
```

## Debugging

### Frontend Debugging
```typescript
// Use React DevTools
// Add debug logging
console.log('Component state:', { cats, selectedCat });

// Error boundaries for graceful failures
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Backend Debugging
```python
# Logging
import logging
logger = logging.getLogger(__name__)

@app.get("/debug")
async def debug_endpoint():
    logger.info("Debug endpoint called")
    return {"status": "debug"}
```

### Docker Debugging
```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Execute commands in containers
docker-compose exec frontend sh
docker-compose exec backend bash

# Database access
docker-compose exec db psql -U postgres -d cattracker
```

## Performance Tips

### Frontend Optimization
```typescript
// Lazy loading
const CatChart = lazy(() => import('./CatChart'));

// Memoization
const MemoizedCatCard = memo(CatCard);

// Efficient re-renders
const { cats } = useCats();
const memoizedCats = useMemo(() => 
  cats.filter(cat => cat.isActive), [cats]
);
```

### Backend Optimization
```python
# Database queries
cats = db.query(Cat).options(joinedload(Cat.weight_records)).all()

# Async operations
async def bulk_operation():
    tasks = [process_cat(cat) for cat in cats]
    await asyncio.gather(*tasks)
```

## Common Issues & Solutions

### Material 3 Styling Issues
```typescript
// Theme not applied
// Solution: Wrap with ThemeProvider
<ThemeProvider theme={material3Theme}>
  <App />
</ThemeProvider>

// Inconsistent spacing
// Solution: Use theme spacing
sx={{ p: 3, m: 2 }}  // 3 * 8px = 24px padding
```

### Biome Configuration Issues
```bash
# Biome not finding files
# Solution: Check biome.json includes
"files": {
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}

# Conflicting rules
# Solution: Override specific rules
"rules": {
  "suspicious": {
    "noExplicitAny": "warn"  // Instead of error
  }
}
```

### API Integration Issues
```typescript
// CORS issues
// Solution: Check backend CORS configuration

// Authentication issues
// Solution: Verify token storage and headers
const token = sessionStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```
