import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Cat } from '../../types/api';
import CatForm from '../CatForm';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

describe('CatForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

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
        open={true}
        onSubmit={mockOnSubmit}
        initialData={initialData}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByDisplayValue('Fluffy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required name field', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/cat name is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates required target weight field', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    await user.type(nameInput, 'Test Cat');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/target weight is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight is a positive number', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '-5');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/must be a positive number/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight is a valid number', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, 'not-a-number');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/must be a valid number/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates name length constraints', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    // Test name too long
    await user.type(nameInput, 'a'.repeat(101));
    await user.type(weightInput, '5.0');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/name must be 100 characters or less/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates target weight maximum', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '101');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/target weight must be 100 lbs or less/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    render(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    await user.type(nameInput, 'Fluffy');
    await user.type(weightInput, '12.5');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Fluffy',
        target_weight: 12.5,
      });
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const initialData: Cat = {
      id: 1,
      name: 'Fluffy',
      target_weight: 12.5,
      user_id: 1,
    };

    render(
      <CatForm
        open={true}
        onSubmit={mockOnSubmit}
        initialData={initialData}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles form submission errors gracefully', async () => {
    const user = userEvent.setup();
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(new Error('Submission failed'));

    render(<CatForm open={true} onSubmit={mockOnSubmitWithError} onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/cat name/i);
    const weightInput = screen.getByLabelText(/target weight/i);

    await user.type(nameInput, 'Test Cat');
    await user.type(weightInput, '5.0');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmitWithError).toHaveBeenCalled();
    });
  });

  it('resets form when closed and reopened', async () => {
    const { rerender } = render(
      <CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />
    );

    const nameInput = screen.getByLabelText(/cat name/i);
    await userEvent.type(nameInput, 'Test Cat');

    // Close the form
    rerender(<CatForm open={false} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Reopen the form
    rerender(<CatForm open={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const newNameInput = screen.getByLabelText(/cat name/i);
    expect(newNameInput).toHaveValue('');
  });

  it('displays correct button text for editing', () => {
    const initialData: Cat = {
      id: 1,
      name: 'Fluffy',
      target_weight: 12.5,
      user_id: 1,
    };

    render(
      <CatForm
        open={true}
        onSubmit={mockOnSubmit}
        initialData={initialData}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
