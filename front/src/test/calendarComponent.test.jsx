import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriseDeRdv from '../components/calendarComponent';
import { test, expect , jest } from '@jest/globals';

jest.mock('../hooks/appointmentHook', () => ({
  __esModule: true,
  default: () => ({
    creneauxOccupes: [],
    jourSelectionne: '2025-02-12',
    chargerCreneaux: jest.fn(),
    prendreRdv: jest.fn(),
  }),
}));

test('renders PriseDeRdv component', () => {
  render(<PriseDeRdv />);

  expect(screen.getByText('Prendre rendez-vous')).toBeInTheDocument();
  expect(screen.getByText('Choisissez un jour :')).toBeInTheDocument();
});