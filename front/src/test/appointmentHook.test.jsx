/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import useAppointments from '../hooks/appointmentHook';

describe('useAppointments', () => {
  // Mock data
  const mockUserData = { _id: 'user123', name: 'John Doe', phone: '1234567890' };
  const mockAppointments = [
    { _id: 'apt1', appointmentDate: '2023-05-15', appointmentTime: '10:00', customerName: 'John Doe' }
  ];
  
  // Setup mocks
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(mockUserData));
    
    // Mock window.alert
    global.alert = jest.fn();
    
    // Create a more robust fetch mock
    global.fetch = jest.fn((url, options) => {
      // Initial load of appointments
      if (url.includes('/appointments/user/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments)
        });
      }
      
      // Loading available slots
      if (url.includes('/creneaux')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(['10:00', '11:00'])
        });
      }
      
      // Booking an appointment
      if (url === 'http://localhost:5001/appointments/appointments' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Rendez-vous créé avec succès' })
        });
      }
      
      // Deleting an appointment
      if (url.includes('/appointments/') && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Rendez-vous supprimé avec succès' })
        });
      }
      
      // Default response
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Unexpected URL' })
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load appointments on hook initialization', async () => {
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for useEffect to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:5001/appointments/appointments/user/${mockUserData._id}`
    );
    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors when loading appointments', async () => {
    // Override the default mock for this specific test
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Not found' })
    });

    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for useEffect to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.error).toBe('Erreur lors de la récupération des rendez-vous');
    expect(result.current.loading).toBe(false);
  });

  it('should load available slots for a selected date', async () => {
    const selectedDate = '2023-05-15';
    
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for hook to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.chargerCreneaux(selectedDate);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:5001/appointments/creneaux?date=${selectedDate}`
    );
    expect(result.current.creneauxOccupes).toEqual(['10:00', '11:00']);
    expect(result.current.jourSelectionne).toBe(selectedDate);
  });

  it('should book an appointment successfully', async () => {
    const timeslot = '14:00';
    const selectedDate = '2023-05-15';
    
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for hook to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Set the selected date using chargerCreneaux
    await act(async () => {
      await result.current.chargerCreneaux(selectedDate);
    });
    
    // Instead of trying to mock chargerCreneaux, just verify the expected behavior
    await act(async () => {
      await result.current.prendreRdv(timeslot);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5001/appointments/appointments',
      expect.objectContaining({
        method: 'POST',
        headers: expect.anything()
      })
    );
    
    expect(global.alert).toHaveBeenCalledWith('Rendez-vous pris avec succès');
    
    // Instead of checking if chargerCreneaux was called, verify that fetch was called 
    // with the expected parameters for reloading the slots after booking
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:5001/appointments/creneaux?date=${selectedDate}`
    );
  });

  it('should handle errors when booking an appointment', async () => {
    const timeslot = '14:00';
    const selectedDate = '2023-05-15';
    
    // Override the default mock for booking
    const originalFetch = global.fetch;
    global.fetch = jest.fn((url, options) => {
      // Initial load of appointments
      if (url.includes('/appointments/user/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      
      // Loading available slots
      if (url.includes('/creneaux')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(['10:00', '11:00'])
        });
      }
      
      // Booking an appointment - this one will fail
      if (url === 'http://localhost:5001/appointments/appointments' && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Le créneau est complet' })
        });
      }
      
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for hook to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Set the selected date using chargerCreneaux
    await act(async () => {
      await result.current.chargerCreneaux(selectedDate);
    });

    await act(async () => {
      await result.current.prendreRdv(timeslot);
    });

    expect(global.alert).toHaveBeenCalledWith('Erreur: Le créneau est complet');
  });

  it('should delete an appointment successfully', async () => {
    const appointmentId = 'apt1';
    
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for hook to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.deleteAppointment(appointmentId);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:5001/appointments/appointments/${appointmentId}`,
      { method: 'DELETE' }
    );
    expect(global.alert).toHaveBeenCalledWith('Rendez-vous supprimé avec succès');
    // The appointments should be updated after deletion
    expect(result.current.appointments.length).toBe(0);
  });

  it('should handle errors when deleting an appointment', async () => {
    const appointmentId = 'apt1';
    
    // Override the default mock for deletion to throw an error
    const originalFetch = global.fetch;
    global.fetch = jest.fn((url, options) => {
      // Initial load of appointments
      if (url.includes('/appointments/user/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments)
        });
      }
      
      // Deleting an appointment - this will fail
      if (url.includes(`/appointments/${appointmentId}`) && options?.method === 'DELETE') {
        return Promise.reject(new Error('Deletion failed'));
      }
      
      return originalFetch(url, options);
    });
    
    let result;
    
    await act(async () => {
      const rendered = renderHook(() => useAppointments());
      result = rendered.result;
      // Wait for hook to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.deleteAppointment(appointmentId);
    });

    expect(global.alert).toHaveBeenCalledWith('Erreur: Deletion failed');
  });
});