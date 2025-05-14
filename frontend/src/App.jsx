import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CatForm from './components/CatForm';
import CatList from './components/CatList';
import WeightForm from './components/WeightForm';
import WeightTable from './components/WeightTable';
import WeightChart from './components/WeightChart';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from './components/ui/toast';
import { Button } from './components/ui/button';

// API base URL - use environment variable or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [cats, setCats] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [weights, setWeights] = useState([]);
  const [plotData, setPlotData] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [toast, setToast] = useState({ open: false, title: '', description: '' });

  // Fetch cats on component mount
  useEffect(() => {
    fetchCats();
  }, []);

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

  const fetchCats = async () => {
    try {
      const response = await axios.get(`${API_URL}/cats/`);
      setCats(response.data);
      
      // Select the first cat if none is selected
      if (response.data.length > 0 && !selectedCatId) {
        setSelectedCatId(response.data[0].id);
      }
    } catch (error) {
      showToast('Error', 'Failed to fetch cats');
      console.error('Error fetching cats:', error);
    }
  };

  const fetchWeights = async (catId) => {
    try {
      const response = await axios.get(`${API_URL}/cats/${catId}/weights/`);
      setWeights(response.data);
    } catch (error) {
      showToast('Error', 'Failed to fetch weight records');
      console.error('Error fetching weights:', error);
    }
  };

  const fetchPlotData = async (catId) => {
    try {
      const response = await axios.get(`${API_URL}/cats/${catId}/plot`);
      setPlotData(response.data);
    } catch (error) {
      showToast('Error', 'Failed to fetch plot data');
      console.error('Error fetching plot data:', error);
    }
  };

  const handleAddCat = async (catData) => {
    try {
      const response = await axios.post(`${API_URL}/cats/`, catData);
      setCats([...cats, response.data]);
      setSelectedCatId(response.data.id);
      setShowAddCat(false);
      showToast('Success', `${response.data.name} added successfully`);
    } catch (error) {
      showToast('Error', 'Failed to add cat');
      console.error('Error adding cat:', error);
    }
  };

  const handleUpdateCat = async (catData) => {
    try {
      const response = await axios.put(`${API_URL}/cats/${editingCat.id}`, catData);
      setCats(cats.map(cat => cat.id === editingCat.id ? response.data : cat));
      setEditingCat(null);
      showToast('Success', `${response.data.name} updated successfully`);
    } catch (error) {
      showToast('Error', 'Failed to update cat');
      console.error('Error updating cat:', error);
    }
  };

  const handleDeleteCat = async (catId) => {
    if (window.confirm('Are you sure you want to delete this cat?')) {
      try {
        await axios.delete(`${API_URL}/cats/${catId}`);
        const updatedCats = cats.filter(cat => cat.id !== catId);
        setCats(updatedCats);
        
        if (selectedCatId === catId) {
          setSelectedCatId(updatedCats.length > 0 ? updatedCats[0].id : null);
        }
        
        showToast('Success', 'Cat deleted successfully');
      } catch (error) {
        showToast('Error', 'Failed to delete cat');
        console.error('Error deleting cat:', error);
      }
    }
  };

  const handleAddWeight = async (weightData) => {
    try {
      await axios.post(`${API_URL}/cats/${selectedCatId}/weights/`, weightData);
      fetchWeights(selectedCatId);
      fetchPlotData(selectedCatId);
      showToast('Success', 'Weight record added successfully');
    } catch (error) {
      showToast('Error', 'Failed to add weight record');
      console.error('Error adding weight:', error);
    }
  };

  const handleDeleteWeight = async (weightId) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      try {
        await axios.delete(`${API_URL}/weights/${weightId}`);
        fetchWeights(selectedCatId);
        fetchPlotData(selectedCatId);
        showToast('Success', 'Weight record deleted successfully');
      } catch (error) {
        showToast('Error', 'Failed to delete weight record');
        console.error('Error deleting weight:', error);
      }
    }
  };

  const showToast = (title, description) => {
    setToast({ open: true, title, description });
    setTimeout(() => setToast({ open: false, title: '', description: '' }), 3000);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-6">
          <div className="container">
            <h1 className="text-3xl font-bold">Cat Weight Tracker</h1>
            <p className="text-sm opacity-90">Monitor your cat&apos;s weight progress</p>
          </div>
        </header>

        <main className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Cat Management and Weight Recording */}
            <div className="lg:col-span-4 space-y-8">
              {/* Cat Management Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Cats</h2>
                  <Button onClick={() => setShowAddCat(!showAddCat)}>
                    {showAddCat ? 'Cancel' : 'Add Cat'}
                  </Button>
                </div>

                {showAddCat && (
                  <CatForm onSubmit={handleAddCat} />
                )}

                {editingCat && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Edit Cat</h3>
                    <CatForm 
                      onSubmit={handleUpdateCat} 
                      initialData={editingCat} 
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => setEditingCat(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <CatList 
                  cats={cats} 
                  onSelect={setSelectedCatId} 
                  onEdit={setEditingCat}
                  onDelete={handleDeleteCat}
                  selectedCatId={selectedCatId}
                />
              </div>

              {/* Weight Recording Section */}
              <div className="space-y-6 pt-4 border-t border-border">
                <h2 className="text-2xl font-bold">Record Weight</h2>
                {selectedCatId ? (
                  <WeightForm 
                    onSubmit={handleAddWeight} 
                    catId={selectedCatId} 
                  />
                ) : (
                  <p className="text-muted-foreground">Select a cat to record weight</p>
                )}
              </div>
            </div>

            {/* Right Column - Weight History and Chart */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-2xl font-bold">Weight History</h2>
              {selectedCatId ? (
                <>
                  <div className="h-96">
                    <WeightChart plotData={plotData} />
                  </div>
                  <h3 className="text-xl font-bold mt-8">Weight Records</h3>
                  <WeightTable 
                    weights={weights} 
                    onDelete={handleDeleteWeight} 
                  />
                </>
              ) : (
                <p className="text-muted-foreground">Select a cat to view weight history</p>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-muted py-6">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Cat Weight Tracker &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>

      {toast.open && (
        <Toast>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
}

export default App;