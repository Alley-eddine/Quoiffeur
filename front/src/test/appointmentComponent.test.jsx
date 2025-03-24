import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Appointments from '../components/appointmentComponent';
import { test, expect, jest } from '@jest/globals';

// Préfixe "mock" pour que Jest autorise cette variable
const mockFutureDate = new Date();
mockFutureDate.setFullYear(mockFutureDate.getFullYear() + 1);
const mockFormattedDate = mockFutureDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

// Créez une fonction mock que vous pourrez référencer plus tard
const mockDeleteAppointment = jest.fn();

jest.mock('../hooks/appointmentHook', () => ({
  __esModule: true,
  default: () => ({
    appointments: [
      {
        _id: '1',
        appointmentDate: mockFormattedDate,
        appointmentTime: '10:00',
        customerName: 'John Doe',
      },
    ],
    loading: false,
    error: null,
    deleteAppointment: mockDeleteAppointment,
  }),
}));

test('renders Appointments component', () => {
  render(<Appointments />);

  expect(screen.getByText('Your Appointments')).toBeInTheDocument();
  expect(screen.getByText(`${mockFormattedDate} - 10:00 with John Doe`)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
});

test('calls deleteAppointment when "Supprimer" button is clicked', () => {
  render(<Appointments />);

  // Trouver et cliquer sur le bouton
  const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
  fireEvent.click(deleteButton);

  // Vérifier que la fonction mock a été appelée
  expect(mockDeleteAppointment).toHaveBeenCalledWith('1');
});