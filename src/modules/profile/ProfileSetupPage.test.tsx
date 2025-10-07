import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileSetupPage } from './ProfileSetupPage';
import { useProfileStore } from '../../store/profileStore';
import { TopBar } from '../layout/TopBar';
import { ProfileSelection } from './ProfileSelection';

function renderWithRoutes(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/" element={<><TopBar /><ProfileSelection /></>} />
        <Route path="/profiles/new" element={<><TopBar /><ProfileSetupPage /></>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Profile setup flow', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('navigates to setup page when clicking new profile', () => {
    renderWithRoutes('/');
  const newBtn = screen.getByRole('button', { name: /\+ Neues Profil/i });
    fireEvent.click(newBtn);
  expect(screen.getByText(/Neues Profil anlegen/i)).not.toBeNull();
  });

  it('validates empty form', () => {
    renderWithRoutes('/profiles/new');
    const save = screen.getByText(/Speichern/i);
    fireEvent.click(save);
  expect(screen.getByText(/Profilname fehlt/i)).not.toBeNull();
    expect(useProfileStore.getState().profiles.length).toBe(0);
  });

  it('creates profile and returns to main page', () => {
    renderWithRoutes('/profiles/new');
    fireEvent.change(screen.getByLabelText(/Profil Name/i), { target: { value: 'MainBox' }});
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'Max' }});
    fireEvent.change(screen.getByLabelText(/E-Mail Adresse/i), { target: { value: 'max@example.com' }});
    fireEvent.change(screen.getByLabelText(/Provider/i), { target: { value: 'outlook' }});
    fireEvent.click(screen.getByText(/Speichern/i));
  expect(screen.queryByText(/Neues Profil anlegen/i)).toBeNull();
    const store = useProfileStore.getState();
    expect(store.profiles.length).toBe(1);
    expect(store.profiles[0].provider).toBe('outlook');
  });

  it('cancel returns without creating profile', () => {
    renderWithRoutes('/profiles/new');
    fireEvent.click(screen.getByText(/Abbrechen/i));
  expect(screen.queryByText(/Neues Profil anlegen/i)).toBeNull();
    expect(useProfileStore.getState().profiles.length).toBe(0);
  });
});
