import React from 'react';
import { render, screen } from '@testing-library/react';
import WeightChart from '../WeightChart';

// Mock the Plot component from react-plotly.js
jest.mock('react-plotly.js', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-plot" />
}));

describe('WeightChart', () => {
  test('renders no data message when plotData is null', () => {
    render(<WeightChart plotData={null} />);
    expect(screen.getByText(/no data available for chart/i)).toBeInTheDocument();
  });
  
  test('renders no data message when plotData has empty dates', () => {
    const emptyPlotData = {
      name: 'Whiskers',
      dates: [],
      weights: [],
      target_weight: 4.5
    };
    render(<WeightChart plotData={emptyPlotData} />);
    expect(screen.getByText(/no data available for chart/i)).toBeInTheDocument();
  });
  
  test('renders chart when plotData is provided', () => {
    const plotData = {
      name: 'Whiskers',
      dates: ['2023-11-01', '2023-11-08'],
      weights: [4.8, 4.6],
      target_weight: 4.5
    };
    render(<WeightChart plotData={plotData} />);
    
    expect(screen.getByText(/weight trend for whiskers/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
  });
});