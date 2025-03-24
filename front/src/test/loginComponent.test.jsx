import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginComponent from '../components/loginComponent';
import { test, expect, jest } from '@jest/globals';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/loginHook', () => ({
  __esModule: true,
  default: () => ({
    login: jest.fn().mockImplementation(() => {
      mockNavigate('/');
    }),
    loading: false,
    error: null,
    user: null,
  }),
}));

test('renders LoginComponent and handles login', async () => {
  render(<LoginComponent />);

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByText(/Login/i);

  await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);
  });

  expect(mockNavigate).toHaveBeenCalledWith('/');
});