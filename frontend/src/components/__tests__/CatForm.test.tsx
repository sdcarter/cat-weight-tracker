import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatForm from '../CatForm';
import { Cat } from '../../types/api';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe('CatForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CatForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/cat name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target weight/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders with initial data when editing', () => {
    const initialData: Cat = {
      id: 1,
      name: 'Fluffy',
      target_weight: 12.5,
      user_id: 1,
    };

    render(
      <CatForm 
        onSubmit={mockOnSubmit} 
        initialData={initialData}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('Fluffy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates cat name length', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const longName = 'a'.repeat(101); // Exceeds 100 character limit
    
    await user.type(nameInput, longName);
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/name must be less than 100 characters/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight is positive', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    
    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '-5');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/must be greater than 0/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight maximum', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    
    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '100');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/weight must be less than 50/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight is a number', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    
    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, 'not-a-number');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/must be a valid number/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    
    await user.type(nameInput, 'Fluffy');
    await user.type(weightInput, '12.5');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Fluffy',
        target_weight: 12.5,
      });
    });
  });

  it('trims whitespace from cat name', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    
    await user.type(nameInput, '  Fluffy  ');
    await user.type(weightInput, '12.5');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Fluffy', // Whitespace should be trimmed
        target_weight: 12.5,
      });
    });
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const submitButton = screen.getByRole('button', { name: /save/i });
    
    // Submit empty form to trigger validation error
    await user.click(submitButton);
    expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
    
    // Start typing to clear error
    await user.type(nameInput, 'F');
    expect(screen.queryByText(/this field is required/i)).not.toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup();
    // Mock a slow submission
    const slowSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CatForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);
    const submitButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '10');
    await user.click(submitButton);

    // Check that buttons are disabled during submission
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CatForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    expect(nameInput).toHaveAttribute('required');
    expect(weightInput).toHaveAttribute('required');
    expect(nameInput).toHaveAttribute('maxLength', '100');
    expect(weightInput).toHaveAttribute('min', '0.1');
    expect(weightInput).toHaveAttribute('max', '50');
  });

  it('shows error with proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<CatForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/this field is required/i);
    const nameInput = screen.getByLabelText(/cat name/i);

    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
  });
});
