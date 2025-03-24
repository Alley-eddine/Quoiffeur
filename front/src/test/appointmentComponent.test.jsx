import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Appointments from '../components/appointmentComponent';
import { test, expect, jest } from '@jest/globals';

jest.mock('../hooks/appointmentHook', () => ({
  __esModule: true,
  default: () => ({
    appointments: [
      {
        _id: '1',
        appointmentDate: '2025-02-12',
        appointmentTime: '10:00',
        customerName: 'John Doe',
      },
    ],
    loading: false,
    error: null,
    deleteAppointment: jest.fn(),
  }),
}));

test('renders Appointments component', () => {
  render(<Appointments />);

  expect(screen.getByText('Your Appointments')).toBeInTheDocument();
  expect(screen.getByText('2025-02-12 - 10:00 with John Doe')).toBeInTheDocument();
  expect(screen.getByText('Supprimer')).toBeInTheDocument();
});