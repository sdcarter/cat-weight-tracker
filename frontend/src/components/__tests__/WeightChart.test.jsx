import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import WeightChart from '../WeightChart';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('WeightChart', () => {
  test('renders chart component when plotData is null', () => {
    render(<WeightChart plotData={null} />);
    
    // Check that the main elements are rendered
    expect(screen.getByText('Weight Progress Chart')).toBeTruthy();
    expect(screen.getByText('Chart visualization coming soon!')).toBeTruthy();
    expect(screen.getByText(/Data points.*0/)).toBeTruthy();
    expect(screen.getByText(/Target weight.*0/)).toBeTruthy();
  });

  test('renders chart component when plotData has empty dates', () => {
    const emptyPlotData = {
      name: 'Whiskers',
      dates: [],
      weights: [],
      target_weight: 4.5,
    };
    render(<WeightChart plotData={emptyPlotData} />);
    
    // Check that the main elements are rendered
    expect(screen.getByText('Weight Progress Chart')).toBeTruthy();
    expect(screen.getByText('Chart visualization coming soon!')).toBeTruthy();
    expect(screen.getByText(/Data points.*0/)).toBeTruthy();
    expect(screen.getByText(/Target weight.*4.5/)).toBeTruthy();
  });

  test('renders chart component when plotData is provided', () => {
    const plotData = {
      name: 'Whiskers',
      dates: ['2023-11-01', '2023-11-08'],
      weights: [4.8, 4.6],
      target_weight: 4.5,
    };
    render(<WeightChart plotData={plotData} />);

    // Check that the main elements are rendered
    expect(screen.getByText('Weight Progress Chart')).toBeTruthy();
    expect(screen.getByText('Chart visualization coming soon!')).toBeTruthy();
    expect(screen.getByText(/Data points.*2/)).toBeTruthy();
    expect(screen.getByText(/Target weight.*4.5/)).toBeTruthy();
  });
});
