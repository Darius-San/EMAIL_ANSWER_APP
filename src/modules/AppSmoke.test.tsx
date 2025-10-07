import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

describe('App Smoke', () => {
  it('renders profile heading', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByText(/Profile/i)).not.toBeNull();
  });
});
