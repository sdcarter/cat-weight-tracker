# GitHub Copilot Instructions

## 🎯 Project Overview
Modern cat weight tracking application with React 18, Material 3 design, TypeScript, and FastAPI backend.

## 🛠️ Tech Stack

**Frontend**: React 18 + TypeScript + Material UI v6 + Biome + Vite + Vitest  
**Backend**: FastAPI + Python 3.11 + PostgreSQL + SQLAlchemy + PyJWT

## 🎨 Material 3 Patterns

### Component Template
```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const { t } = useTranslation();
  
  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('component.title', 'Default Title')}
        </Typography>
        <Button variant="contained" sx={{ borderRadius: 3 }}>
          {t('component.action', 'Action')}
        </Button>
      </CardContent>
    </Card>
  );
};
```

### Design Tokens
```typescript
// Colors & spacing
sx={{
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  p: 3, m: 2, gap: 1.5,
  borderRadius: 3, // 24px for cards/buttons
}}
```

### Form Pattern
```typescript
<Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  <TextField
    label="Field Label"
    variant="outlined"
    fullWidth
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
  />
  <Button type="submit" variant="contained" sx={{ borderRadius: 3 }}>
    Submit
  </Button>
</Box>
```

### Dialog Pattern
```typescript
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
  PaperProps={{ sx: { borderRadius: 4 } }}>
  <DialogTitle>
    <Typography variant="h5">Dialog Title</Typography>
  </DialogTitle>
  <DialogContent>{/* Content */}</DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="contained" sx={{ borderRadius: 3 }}>Confirm</Button>
  </DialogActions>
</Dialog>
```

## 🔧 TypeScript Patterns

### Interfaces & API Services
```typescript
interface ComponentProps {
  id: number;
  name: string;
  optional?: boolean;
  onAction: (id: number) => void;
}

class ApiService {
  private client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
  });

  async getResource<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }
}
```

### Custom Hooks
```typescript
const useResourceData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.get<T>(endpoint);
        setData(result);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
```

## 🐍 FastAPI Patterns

### Route Definitions
```python
@app.post("/cats/", response_model=schemas.Cat)
async def create_cat(
    cat: schemas.CatCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> models.Cat:
    return crud.create_cat(db=db, cat=cat, user_id=current_user.id)
```

### Error Handling
```python
@app.get("/cats/{cat_id}")
async def get_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = crud.get_cat(db, cat_id=cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Cat not found")
    return cat
```

## 🧪 Testing Patterns

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { material3Theme } from '../theme/material3Theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={material3Theme}>
      {component}
    </ThemeProvider>
  );
};

test('component behavior', () => {
  renderWithTheme(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### API Tests
```python
def test_create_resource(client: TestClient, db: Session):
    data = {"name": "Test", "value": 123}
    response = client.post("/resource/", json=data)
    
    assert response.status_code == 201
    assert response.json()["name"] == "Test"
```

## 🎨 Common UI Patterns

### Loading State
```typescript
if (loading) {
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
    </Box>
  );
}
```

### Error State
```typescript
if (error) {
  return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>
      {error}
    </Alert>
  );
}
```

### Empty State
```typescript
<Box sx={{ textAlign: 'center', py: 6 }}>
  <EmptyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
  <Typography variant="h6" color="text.secondary">No items found</Typography>
  <Typography variant="body2" color="text.disabled">
    Add your first item to get started
  </Typography>
</Box>
```

## 🌍 Internationalization
Always use i18next:
```typescript
const { t } = useTranslation();

// In JSX
<Typography>{t('cats.title', 'My Cats')}</Typography>

// In functions
const errorMessage = t('errors.fetchFailed', 'Failed to fetch data');
```

## ⚡ Performance
```typescript
// Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoization
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => 
    data.map(item => processItem(item)), [data]
  );
  return <div>{/* Component content */}</div>;
});
```

## 📁 File Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components  
├── services/      # API services
├── hooks/         # Custom hooks
├── types/         # TypeScript definitions
├── theme/         # Material 3 theme
└── utils/         # Utility functions
```

## ✅ Code Generation Checklist
When generating code, ensure:
- ✅ Material 3 design consistency
- ✅ TypeScript type safety
- ✅ Biome linting compliance
- ✅ Internationalization support
- ✅ Error handling & loading states
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Performance optimization (memoization, lazy loading)

Generate code that follows these patterns and maintains consistency with the existing codebase.
