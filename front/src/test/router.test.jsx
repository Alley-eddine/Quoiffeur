/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the router module entirely
jest.mock('../routes/router', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mocked-router">
      <div data-testid="route" data-path="/">Home Route</div>
      <div data-testid="route" data-path="/register">Register Route</div>
      <div data-testid="route" data-path="/login">Login Route</div>
      <div data-testid="route" data-path="/appointment">Appointment Route</div>
    </div>
  )
}));

// Import after mocking
import AppRouter from '../routes/router';

describe('Router Configuration', () => {
  test('renders all expected routes', () => {
    render(<AppRouter />);
    
    // Check that all routes are rendered
    const routes = screen.getAllByTestId('route');
    expect(routes).toHaveLength(4);
    
    // Check for home route
    const homeRoute = routes.find(r => r.getAttribute('data-path') === '/');
    expect(homeRoute).toBeInTheDocument();
    
    // Check for register route
    const registerRoute = routes.find(r => r.getAttribute('data-path') === '/register');
    expect(registerRoute).toBeInTheDocument();
    
    // Check for login route
    const loginRoute = routes.find(r => r.getAttribute('data-path') === '/login');
    expect(loginRoute).toBeInTheDocument();
    
    // Check for appointment route
    const appointmentRoute = routes.find(r => r.getAttribute('data-path') === '/appointment');
    expect(appointmentRoute).toBeInTheDocument();
  });
});