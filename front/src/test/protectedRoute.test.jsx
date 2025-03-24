import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/protectedRoute';
import { test, expect } from '@jest/globals';

test('renders PrivateRoute component', () => {
  localStorage.setItem('token', 'valid-token');

  const { getByText } = render(
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><div>Protected Content</div></PrivateRoute>} />
      </Routes>
    </Router>
  );

  expect(getByText('Protected Content')).toBeInTheDocument();
});

test('redirects to /register if not authenticated', () => {
  localStorage.removeItem('token');

  const { queryByText } = render(
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><div>Protected Content</div></PrivateRoute>} />
        <Route path="/register" element={<div>Register Page</div>} />
      </Routes>
    </Router>
  );

  expect(queryByText('Protected Content')).not.toBeInTheDocument();
  expect(queryByText('Register Page')).toBeInTheDocument();
});