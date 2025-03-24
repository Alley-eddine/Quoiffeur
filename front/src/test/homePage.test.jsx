import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/home';
import { test, expect, jest } from '@jest/globals';

jest.mock('../components/navbar', () => {
  const NavbarMock = () => <div>Navbar</div>;
  NavbarMock.displayName = 'NavbarMock';
  return NavbarMock;
});
jest.mock('../components/calendarComponent', () => {
  const CalendarMock = () => <div>Calendar</div>;
  CalendarMock.displayName = 'CalendarMock';
  return CalendarMock;
});

test('renders Home component', () => {
  const { getByText } = render(<Home />);

  expect(getByText('Navbar')).toBeInTheDocument();
  expect(getByText('Calendar')).toBeInTheDocument();
});