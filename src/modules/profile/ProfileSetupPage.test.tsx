import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileSetupPage } from './ProfileSetupPage';
import { useProfileStore } from '../../store/profileStore';
import { ProfileSelection } from './ProfileSelection';

function renderWithRoutes(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
    <Routes>
      <Route path="/" element={<ProfileSelection />} />
      <Route path="/profiles/new" element={<ProfileSetupPage />} />
    </Routes>
    </MemoryRouter>
  );
}

describe('Profile setup flow', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('shows inline IMAP setup fields when provider is imap', () => {
    renderWithRoutes('/profiles/new');
    // default provider is imap so IMAP host field should be present
    expect(screen.getByLabelText(/IMAP Host/i)).not.toBeNull();
  });

  it('validates empty form', () => {
    renderWithRoutes('/profiles/new');
  const save = screen.getByRole('button', { name: /^Speichern$/i });
    fireEvent.click(save);
  expect(screen.getByText(/Profilname fehlt/i)).not.toBeNull();
    expect(useProfileStore.getState().profiles.length).toBe(0);
  });

  it('creates outlook profile and returns to main page', () => {
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
  it('creates imap profile with inline settings and persists config', () => {
    renderWithRoutes('/profiles/new');
    fireEvent.change(screen.getByLabelText(/Profil Name/i), { target: { value: 'Inbox' }});
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'Agent' }});
    fireEvent.change(screen.getByLabelText(/E-Mail Adresse/i), { target: { value: 'agent@example.com' }});
  fireEvent.change(screen.getByLabelText(/IMAP Host/i), { target: { value: 'imap.example.com' }});
    fireEvent.change(screen.getByLabelText(/Port/i), { target: { value: '993' }});
    fireEvent.change(screen.getByLabelText(/IMAP Benutzer/i), { target: { value: 'agent@example.com' }});
  fireEvent.change(screen.getByLabelText(/^Passwort$/i), { target: { value: 'secret' }});
    fireEvent.click(screen.getByLabelText(/Passwort lokal speichern/i));
  fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));
    const store = useProfileStore.getState();
    expect(store.profiles.length).toBe(1);
    const p = store.profiles[0];
    expect(p.imapConfigured).toBe(true);
    expect(p.imapHost).toBe('imap.example.com');
    expect(p.imapPassword).toBe('secret');
  });
});
