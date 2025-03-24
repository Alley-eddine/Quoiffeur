/**
 * @jest-environment jsdom
 */

// Place mocks before imports
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn())
}));

import { renderHook, act } from '@testing-library/react';
import useLogin from '../hooks/loginHook';
import { useNavigate } from 'react-router-dom';

describe('useLogin', () => {
  const mockNavigate = jest.fn();
  
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    localStorage.clear();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  it('should login successfully and navigate to home', async () => {
    const { result } = renderHook(() => useLogin());

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { _id: '1', name: 'John Doe' }, token: 'token' }),
    });

    await act(async () => {
      await result.current.login('john.doe@example.com', 'password123');
    });

    expect(result.current.user).toEqual({ _id: '1', name: 'John Doe' });
    expect(localStorage.getItem('token')).toBe('token');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useLogin());

    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      await result.current.login('john.doe@example.com', 'wrongpassword');
    });

    expect(result.current.error).toBe('Login failed');
  });
});