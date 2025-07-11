import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import CatForm from '../CatForm';

// Mock the i18next hook directly in the test file
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('CatForm', () => {
  const mockSubmit = vi.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  test('renders empty form correctly', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    // Check elements exist
    expect(container.querySelector('label[for="name"]')).toBeTruthy();
    expect(container.querySelector('label[for="target_weight"]')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });
  
  test('renders form with initial data', () => {
    const initialData = { name: 'Whiskers', target_weight: 4.5 };
    const { container } = render(<CatForm onSubmit={mockSubmit} initialData={initialData} />);
    
    // Check input values
    expect(container.querySelector('#name').value).toBe('Whiskers');
    expect(container.querySelector('#target_weight').value).toBe('4.5');
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });
  
  test('submits form with entered data', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    // Fill in the form
    const nameInput = container.querySelector('#name');
    const weightInput = container.querySelector('#target_weight');
    
    fireEvent.change(nameInput, { target: { value: 'Mittens' } });
    fireEvent.change(weightInput, { target: { value: '5.2' } });
    
    // Submit the form
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    // Check if onSubmit was called with the right data
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Mittens',
      target_weight: 5.2
    });
  });
  
  test('submits form with empty values', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    // Submit with empty fields
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    // In the test environment, HTML5 validation doesn't prevent submission
    // So we verify the form was submitted with empty/invalid values
    expect(mockSubmit).toHaveBeenCalledWith({
      name: '',
      target_weight: NaN
    });
  });
});