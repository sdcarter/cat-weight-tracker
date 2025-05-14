import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CatForm from '../CatForm';

describe('CatForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  test('renders empty form correctly', () => {
    render(<CatForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target weight/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
  
  test('renders form with initial data', () => {
    const initialData = { name: 'Whiskers', target_weight: 4.5 };
    render(<CatForm onSubmit={mockSubmit} initialData={initialData} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('Whiskers');
    expect(screen.getByLabelText(/target weight/i)).toHaveValue(4.5);
  });
  
  test('submits form with entered data', () => {
    render(<CatForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Mittens' } });
    fireEvent.change(screen.getByLabelText(/target weight/i), { target: { value: '5.2' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Mittens',
      target_weight: 5.2
    });
  });
  
  test('validates required fields', () => {
    render(<CatForm onSubmit={mockSubmit} />);
    
    // Submit without entering data
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Form should not submit
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});