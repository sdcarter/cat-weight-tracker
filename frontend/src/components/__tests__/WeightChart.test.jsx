import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import WeightChart from '../WeightChart';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock the Plot component from react-plotly.js
vi.mock('react-plotly.js', () => ({
  default: () => <div data-testid="mock-plot" />,
}));

// Mock plotly.js
vi.mock('plotly.js-basic-dist', () => ({}));

describe('WeightChart', () => {
  test('renders no data message when plotData is null', () => {
    const { container } = render(<WeightChart plotData={null} />);
    const noDataElement = container.querySelector('.text-muted-foreground');
    expect(noDataElement).toBeTruthy();
    expect(noDataElement.textContent).toBe('weights.noChartData');
  });

  test('renders no data message when plotData has empty dates', () => {
    const emptyPlotData = {
      name: 'Whiskers',
      dates: [],
      weights: [],
      target_weight: 4.5,
    };
    const { container } = render(<WeightChart plotData={emptyPlotData} />);
    const noDataElement = container.querySelector('.text-muted-foreground');
    expect(noDataElement).toBeTruthy();
    expect(noDataElement.textContent).toBe('weights.noChartData');
  });

  test('renders chart when plotData is provided', () => {
    const plotData = {
      name: 'Whiskers',
      dates: ['2023-11-01', '2023-11-08'],
      weights: [4.8, 4.6],
      target_weight: 4.5,
    };
    const { container } = render(<WeightChart plotData={plotData} />);

    const titleElement = container.querySelector('h3');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('weights.weightTrendFor');

    const plotElement = screen.getByTestId('mock-plot');
    expect(plotElement).toBeTruthy();
  });
});
