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
    
    expect(screen.getByLabelText(/cat name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target weight/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add cat/i })).toBeInTheDocument();
  });
  
  test('renders form with initial data', () => {
    const initialData = { name: 'Whiskers', target_weight: 4.5 };
    render(<CatForm onSubmit={mockSubmit} initialData={initialData} />);
    
    expect(screen.getByLabelText(/cat name/i)).toHaveValue('Whiskers');
    expect(screen.getByLabelText(/target weight/i)).toHaveValue(4.5);
    expect(screen.getByRole('button', { name: /update cat/i })).toBeInTheDocument();
  });
  
  test('submits form with entered data', () => {
    render(<CatForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/cat name/i), { target: { value: 'Mittens' } });
    fireEvent.change(screen.getByLabelText(/target weight/i), { target: { value: '5.2' } });
    fireEvent.click(screen.getByRole('button', { name: /add cat/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Mittens',
      target_weight: 5.2
    });
  });
  
  test('submits form with empty values', () => {
    render(<CatForm onSubmit={mockSubmit} />);
    
    // Submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /add cat/i }));
    
    // In the test environment, HTML5 validation doesn't prevent submission
    // So we verify the form was submitted with empty/invalid values
    expect(mockSubmit).toHaveBeenCalledWith({
      name: '',
      target_weight: NaN
    });
  });
});