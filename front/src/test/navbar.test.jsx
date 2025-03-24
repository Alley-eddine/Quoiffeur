import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../components/navbar';
import { test, expect } from '@jest/globals';

test('renders Navbar component', () => {
  const { getByText } = render(
    <Router>
      <Navbar />
    </Router>
  );

  expect(getByText('Home')).toBeInTheDocument();
  expect(getByText('Mes RDV')).toBeInTheDocument();
});