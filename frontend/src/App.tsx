import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button,
  Fab,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import CatForm from './components/CatForm';
import CatList from './components/CatList';
import WeightForm from './components/WeightForm';
import WeightTable from './components/WeightTable';
import WeightChart from './components/WeightChart';
import AuthScreen from './components/AuthScreen';
import ProfilePage from './pages/ProfilePage';
import UserMenu from './components/UserMenu';
import { useAuth } from './context/AuthContext';
import { Cat, WeightRecord, PlotData, ToastState, CatCreate, WeightRecordCreate } from './types/api';
import { api, handleApiError } from './services/api';
import { material3Theme } from './theme/material3Theme';

function App(): JSX.Element {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [showAddCat, setShowAddCat] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ open: false, title: '', description: '' });

  // Fetch cats when user is authenticated
  useEffect(() => {
    if (user) {
      fetchCats();
    }
  }, [user]);

  // Fetch weights when a cat is selected
  useEffect(() => {
    if (selectedCatId) {
      fetchWeights(selectedCatId);
      fetchPlotData(selectedCatId);
    } else {
      setWeights([]);
      setPlotData(null);
    }
  }, [selectedCatId]);

  const showToast = (title: string, description: string): void => {
    setToast({ open: true, title, description });
  };

  const fetchCats = async (): Promise<void> => {
    try {
      const fetchedCats = await api.cats.getCats();
      setCats(fetchedCats);
    } catch (error) {
      console.error('Error fetching cats:', error);
      showToast('Error', `Failed to fetch cats. ${handleApiError(error)}`);
    }
  };

  const fetchWeights = async (catId: number): Promise<void> => {
    try {
      const fetchedWeights = await api.weights.getWeightRecords(catId);
      setWeights(fetchedWeights);
    } catch (error) {
      console.error('Error fetching weights:', error);
      showToast('Error', `Failed to fetch weights. ${handleApiError(error)}`);
    }
  };

  const fetchPlotData = async (catId: number): Promise<void> => {
    try {
      const data = await api.weights.getPlotData(catId);
      setPlotData(data);
    } catch (error) {
      console.error('Error fetching plot data:', error);
      showToast('Error', `Failed to fetch plot data. ${handleApiError(error)}`);
    }
  };

  const handleCatSubmit = async (catData: CatCreate): Promise<void> => {
    try {
      if (editingCat) {
        // Update existing cat
        await api.cats.updateCat(editingCat.id, catData);
        showToast('Success', 'Cat updated successfully!');
      } else {
        // Create new cat
        await api.cats.createCat(catData);
        showToast('Success', 'Cat added successfully!');
      }

      fetchCats();
      setEditingCat(null);
      setShowAddCat(false);
    } catch (error) {
      console.error('Error saving cat:', error);
      const errorMessage = editingCat ? 'Failed to update cat' : 'Failed to add cat';
      showToast('Error', `${errorMessage}. ${handleApiError(error)}`);
    }
  };

  const handleWeightSubmit = async (weightData: WeightRecordCreate): Promise<void> => {
    if (!selectedCatId) {
      showToast('Error', 'Please select a cat first.');
      return;
    }

    try {
      await api.weights.createWeightRecord(selectedCatId, weightData);
      showToast('Success', 'Weight recorded successfully!');
      fetchWeights(selectedCatId);
      fetchPlotData(selectedCatId);
    } catch (error) {
      console.error('Error saving weight:', error);
      showToast('Error', `Failed to record weight. ${handleApiError(error)}`);
    }
  };

  const handleDeleteCat = async (catId: number): Promise<void> => {
    if (!window.confirm(t('cats.confirmDelete', 'Are you sure you want to delete this cat? This action cannot be undone.'))) {
      return;
    }

    try {
      await api.cats.deleteCat(catId);
      showToast('Success', 'Cat deleted successfully!');
      fetchCats();
      if (selectedCatId === catId) {
        setSelectedCatId(null);
      }
    } catch (error) {
      console.error('Error deleting cat:', error);
      showToast('Error', `Failed to delete cat. ${handleApiError(error)}`);
    }
  };

  const handleDeleteWeight = async (recordId: number): Promise<void> => {
    if (!window.confirm(t('weights.confirmDelete', 'Are you sure you want to delete this weight record?'))) {
      return;
    }

    try {
      await api.weights.deleteWeightRecord(recordId);
      showToast('Success', 'Weight record deleted successfully!');
      if (selectedCatId) {
        fetchWeights(selectedCatId);
        fetchPlotData(selectedCatId);
      }
    } catch (error) {
      console.error('Error deleting weight:', error);
      showToast('Error', `Failed to delete weight record. ${handleApiError(error)}`);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={material3Theme}>
        <CssBaseline />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          bgcolor="background.default"
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={material3Theme}>
        <CssBaseline />
        <AuthScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={material3Theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* App Bar */}
          <AppBar position="static" elevation={0} sx={{ bgcolor: 'surface.container' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                {t('app.title', 'Cat Weight Tracker')}
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Cat Management Section */}
                  <Card elevation={1}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2" color="text.primary">
                          {t('cats.title', 'My Cats')}
                        </Typography>
                        <Button 
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setShowAddCat(true)}
                          sx={{ borderRadius: 3 }}
                        >
                          {t('cats.add', 'Add Cat')}
                        </Button>
                      </Box>
                      
                      <CatList 
                        cats={cats}
                        selectedCatId={selectedCatId}
                        onSelectCat={setSelectedCatId}
                        onEditCat={setEditingCat}
                        onDeleteCat={handleDeleteCat}
                      />
                    </CardContent>
                  </Card>

                  {/* Weight Management Section */}
                  {selectedCatId && (
                    <>
                      <Card elevation={1}>
                        <CardContent>
                          <Typography variant="h5" component="h2" color="text.primary" sx={{ mb: 3 }}>
                            {t('weights.title', 'Weight Management')}
                          </Typography>
                          <WeightForm onSubmit={handleWeightSubmit} />
                        </CardContent>
                      </Card>

                      <Card elevation={1}>
                        <CardContent>
                          <Typography variant="h5" component="h2" color="text.primary" sx={{ mb: 3 }}>
                            {t('weights.history', 'Weight History')}
                          </Typography>
                          <WeightTable 
                            weights={weights} 
                            onDeleteWeight={handleDeleteWeight}
                          />
                        </CardContent>
                      </Card>

                      {plotData && (
                        <Card elevation={1}>
                          <CardContent>
                            <Typography variant="h5" component="h2" color="text.primary" sx={{ mb: 3 }}>
                              {t('chart.title', 'Weight Progress')}
                            </Typography>
                            <WeightChart plotData={plotData} />
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </Box>
              } />
            </Routes>
          </Container>

          {/* Floating Action Button for Quick Add */}
          <Fab
            color="primary"
            aria-label="add cat"
            onClick={() => setShowAddCat(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <AddIcon />
          </Fab>

          {/* Cat Form Dialog */}
          {(showAddCat || editingCat) && (
            <CatForm
              open={showAddCat || !!editingCat}
              onSubmit={handleCatSubmit}
              initialData={editingCat}
              onClose={() => {
                setShowAddCat(false);
                setEditingCat(null);
              }}
            />
          )}

          {/* Toast Notifications */}
          <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={() => setToast({ ...toast, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              onClose={() => setToast({ ...toast, open: false })} 
              severity={toast.title === 'Error' ? 'error' : 'success'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {toast.description}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
