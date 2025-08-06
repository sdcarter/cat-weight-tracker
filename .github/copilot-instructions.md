# GitHub Copilot Instructions - Cat Weight Tracker

## Project Context
Modern React application with Material 3 design system, TypeScript, and Biome tooling for a cat weight tracking system.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material UI v6** (Material 3 Design System)
- **Biome** for linting, formatting, and import organization
- **Vite** for building and development
- **Vitest** with React Testing Library for testing

### Backend
- **FastAPI** with Python 3.11
- **PostgreSQL** with SQLAlchemy ORM
- **JWT** authentication
- **Pydantic** for data validation

## Code Generation Guidelines

### Material 3 Component Patterns

When generating React components, always use Material 3 patterns:

```typescript
// Component template
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const { t } = useTranslation();
  
  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('component.title', 'Default Title')}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ borderRadius: 3 }}
        >
          {t('component.action', 'Action')}
        </Button>
      </CardContent>
    </Card>
  );
};
```

### Styling Conventions

Always use Material 3 design tokens:

```typescript
// Colors
sx={{
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  borderColor: 'outline.variant',
}}

// Spacing (8px base unit)
sx={{ p: 3, m: 2, gap: 1.5 }}

// Border radius
sx={{ borderRadius: 3 }}  // Large: 24px for cards/buttons
sx={{ borderRadius: 2 }}  // Medium: 16px for inputs
```

### Form Patterns

Generate forms using Material 3 components:

```typescript
<Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  <TextField
    label="Field Label"
    variant="outlined"
    fullWidth
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
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
```

### Dialog/Modal Patterns

```typescript
<Dialog 
  open={open} 
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{ sx: { borderRadius: 4 } }}
>
  <DialogTitle>
    <Typography variant="h5">Dialog Title</Typography>
  </DialogTitle>
  <DialogContent>
    {/* Content */}
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="contained" sx={{ borderRadius: 3 }}>
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

## TypeScript Patterns

### Interface Definitions
Always define clear interfaces:

```typescript
interface ComponentProps {
  id: number;
  name: string;
  optional?: boolean;
  onAction: (id: number) => void;
}
```

### API Service Pattern
```typescript
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
        setError(null);
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

## Biome Compliance

### Code Style
- Use `const` for immutable values, `let` for mutable
- Prefer arrow functions for consistency
- Use template literals over string concatenation
- Organize imports automatically (Biome handles this)

### Error Handling
```typescript
try {
  const result = await apiCall();
  handleSuccess(result);
} catch (error) {
  const errorMessage = handleApiError(error);
  showToast('Error', errorMessage);
  console.error('API Error:', error);
}
```

## Backend Patterns (FastAPI)

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

## Testing Patterns

### Component Tests
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
    result = response.json()
    assert result["name"] == "Test"
```

## Common Patterns to Generate

### Loading States
```typescript
if (loading) {
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
    </Box>
  );
}
```

### Error States
```typescript
if (error) {
  return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>
      {error}
    </Alert>
  );
}
```

### Empty States
```typescript
<Box sx={{ textAlign: 'center', py: 6 }}>
  <EmptyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
  <Typography variant="h6" color="text.secondary">
    No items found
  </Typography>
  <Typography variant="body2" color="text.disabled">
    Add your first item to get started
  </Typography>
</Box>
```

### Data Tables
```typescript
<TableContainer component={Paper} sx={{ borderRadius: 2 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Column 1</TableCell>
        <TableCell>Column 2</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.id} hover>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.value}</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => handleEdit(row.id)}>
              <EditIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

## Internationalization

Always use i18next for text:

```typescript
const { t } = useTranslation();

// In JSX
<Typography variant="h6">
  {t('cats.title', 'My Cats')}
</Typography>

// In functions
const errorMessage = t('errors.fetchFailed', 'Failed to fetch data');
```

## Performance Considerations

### Lazy Loading
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Usage
<Suspense fallback={<CircularProgress />}>
  <HeavyComponent />
</Suspense>
```

### Memoization
```typescript
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => 
    data.map(item => processItem(item)),
    [data]
  );

  return <div>{/* Component content */}</div>;
});
```

## File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── services/           # API services
├── hooks/              # Custom hooks
├── types/              # TypeScript definitions
├── theme/              # Material 3 theme
├── context/            # React contexts
└── utils/              # Utility functions
```

When generating code, always consider:
1. Material 3 design consistency
2. TypeScript type safety
3. Biome linting compliance
4. Internationalization support
5. Error handling
6. Loading states
7. Accessibility
8. Performance optimization

Generate code that follows these patterns and maintains consistency with the existing codebase.
