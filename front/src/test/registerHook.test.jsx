/**
 * @jest-environment jsdom
 */

// Place mocks before imports
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => jest.fn())
}));

import { renderHook, act } from '@testing-library/react';
import useRegister from '../hooks/registerHook';
import { useNavigate } from 'react-router-dom';

describe('useRegister', () => {
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

  it('should update form data when handleChange is called', async () => {
    const { result } = renderHook(() => useRegister());

    await act(async () => {
      result.current.handleChange({ target: { name: 'name', value: 'John Doe' } });
    });

    expect(result.current.formData.name).toBe('John Doe');
  });

  it('should register successfully and navigate to login page', async () => {
    const { result } = renderHook(() => useRegister());
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        token: 'register-token',
        data: { _id: '123', name: 'John Doe' }
      }),
    });

    const mockEvent = {
      preventDefault: jest.fn()
    };

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/users/register', expect.any(Object));
    expect(localStorage.getItem('token')).toBe('register-token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle registration errors', async () => {
    const { result } = renderHook(() => useRegister());
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockRejectedValueOnce(new Error('Registration failed'));

    const mockEvent = {
      preventDefault: jest.fn()
    };

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/users/register', expect.any(Object));
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});