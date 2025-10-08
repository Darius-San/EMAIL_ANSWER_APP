import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

/**
 * Guards against accidental duplication of the "+ Neues Profil" action.
 */

describe('Single New Profile Button', () => {
  it('renders exactly one new profile button on root route', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    const btn = screen.getByTestId('topbar-new-profile');
    expect(btn).toBeInTheDocument();
    // Ensure there is only one element with that test id
    expect(document.querySelectorAll('[data-testid="topbar-new-profile"]').length).toBe(1);
  });
});
