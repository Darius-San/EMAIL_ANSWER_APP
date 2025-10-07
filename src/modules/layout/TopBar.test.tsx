import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from './TopBar';
import { useProfileStore } from '../../store/profileStore';
import { useThemeStore } from '../../store/themeStore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileSetupPage } from '../profile/ProfileSetupPage';
import { ProfileSelection } from '../profile/ProfileSelection';

describe('TopBar', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  useThemeStore.setState({ theme: 'warm', setTheme: (t: any) => {
      document.documentElement.setAttribute('data-theme', t);
      useThemeStore.setState({ theme: t });
    }} as any);
  });

  it('navigates to new profile setup page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><TopBar /><ProfileSelection /></>} />
          <Route path="/profiles/new" element={<><TopBar /><ProfileSetupPage /></>} />
        </Routes>
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /\+ Neues Profil/i });
    fireEvent.click(btn);
    expect(screen.getByText(/Neues Profil anlegen/i)).not.toBeNull();
    // ensure no profile auto-created yet
    expect(useProfileStore.getState().profiles.length).toBe(0);
  });

  it('switches theme when clicking a theme button', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TopBar />} />
        </Routes>
      </MemoryRouter>
    );
    const ocean = screen.getByText(/Calm Ocean/i);
    fireEvent.click(ocean);
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
  });
});
