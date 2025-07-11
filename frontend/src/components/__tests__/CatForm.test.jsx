import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import CatForm from '../CatForm';

describe('CatForm', () => {
  const mockSubmit = vi.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  test('renders empty form correctly', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText('cats.name')).toBeInTheDocument();
    expect(screen.getByLabelText('cats.targetWeight')).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
  });
  
  test('renders form with initial data', () => {
    const initialData = { name: 'Whiskers', target_weight: 4.5 };
    const { container } = render(<CatForm onSubmit={mockSubmit} initialData={initialData} />);
    
    expect(screen.getByLabelText('cats.name')).toHaveValue('Whiskers');
    expect(screen.getByLabelText('cats.targetWeight')).toHaveValue(4.5);
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
  });
  
  test('submits form with entered data', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('cats.name'), { target: { value: 'Mittens' } });
    fireEvent.change(screen.getByLabelText('cats.targetWeight'), { target: { value: '5.2' } });
    fireEvent.click(container.querySelector('button[type="submit"]'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Mittens',
      target_weight: 5.2
    });
  });
  
  test('submits form with empty values', () => {
    const { container } = render(<CatForm onSubmit={mockSubmit} />);
    
    // Submit with empty fields
    fireEvent.click(container.querySelector('button[type="submit"]'));
    
    // In the test environment, HTML5 validation doesn't prevent submission
    // So we verify the form was submitted with empty/invalid values
    expect(mockSubmit).toHaveBeenCalledWith({
      name: '',
      target_weight: NaN
    });
  });
});