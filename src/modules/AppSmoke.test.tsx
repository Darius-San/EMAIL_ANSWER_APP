import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

describe('App Smoke', () => {
  it('renders profile heading', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    const heading = screen.getByRole('heading', { name: /Profile/i, level: 1 });
    expect(heading).not.toBeNull();
  });
});
