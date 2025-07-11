import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import WeightChart from '../WeightChart';

// Mock the Plot component from react-plotly.js
vi.mock('react-plotly.js', () => ({
  default: () => <div data-testid="mock-plot" />
}));

// Mock plotly.js
vi.mock('plotly.js-basic-dist', () => ({}));

describe('WeightChart', () => {
  test('renders no data message when plotData is null', () => {
    const { container } = render(<WeightChart plotData={null} />);
    expect(container.querySelector('.text-muted-foreground')).toHaveTextContent('weights.noChartData');
  });
  
  test('renders no data message when plotData has empty dates', () => {
    const emptyPlotData = {
      name: 'Whiskers',
      dates: [],
      weights: [],
      target_weight: 4.5
    };
    const { container } = render(<WeightChart plotData={emptyPlotData} />);
    expect(container.querySelector('.text-muted-foreground')).toHaveTextContent('weights.noChartData');
  });
  
  test('renders chart when plotData is provided', () => {
    const plotData = {
      name: 'Whiskers',
      dates: ['2023-11-01', '2023-11-08'],
      weights: [4.8, 4.6],
      target_weight: 4.5
    };
    const { container } = render(<WeightChart plotData={plotData} />);
    
    expect(container.querySelector('h3')).toHaveTextContent('weights.weightTrendFor');
    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
  });
});