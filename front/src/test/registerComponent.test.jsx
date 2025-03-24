import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RegisterComponent from '../components/registerComponent';
import { test, expect, jest } from '@jest/globals';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/registerHook', () => ({
  __esModule: true,
  default: () => ({
    formData: {
      name: '',
      mail: '',
      password: '',
      phone: '',
    },
    handleChange: jest.fn(),
    handleSubmit: jest.fn().mockImplementation(() => {
      mockNavigate('/login');
    }),
  }),
}));

test('renders RegisterComponent and handles registration', async () => {
  render(<RegisterComponent />);

  const nameInput = screen.getByLabelText(/Name/i);
  const emailInput = screen.getByLabelText(/Mail/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const phoneInput = screen.getByLabelText(/Phone/i);
  const registerButton = screen.getByText(/Register/i);

  await act(async () => {
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    fireEvent.click(registerButton);
  });

  expect(mockNavigate).toHaveBeenCalledWith('/login');
});