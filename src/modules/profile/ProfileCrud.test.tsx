import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileSelection } from './ProfileSelection';
import { ProfileSetupPage } from './ProfileSetupPage';
import { ProfileEditPage } from './ProfileEditPage';
import { useProfileStore } from '../../store/profileStore';
import { TopBar } from '../layout/TopBar';

function renderWith(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/" element={<><TopBar /><ProfileSelection /></>} />
        <Route path="/profiles/new" element={<><TopBar /><ProfileSetupPage /></>} />
        <Route path="/profiles/:id/edit" element={<><TopBar /><ProfileEditPage /></>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Profile CRUD', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('creates then lists profile card', () => {
    renderWith('/');
  const newBtn = screen.getByTestId('topbar-new-profile');
  fireEvent.click(newBtn);
    fireEvent.change(screen.getByLabelText(/Profil Name/i), { target: { value: 'Support' }});
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'Agent' }});
    fireEvent.change(screen.getByLabelText(/E-Mail Adresse/i), { target: { value: 'agent@example.com' }});
    // Switch to outlook to bypass IMAP inline requirement (or fill host). We test IMAP creation separately.
    fireEvent.change(screen.getByLabelText(/Provider/i), { target: { value: 'outlook' }});
    fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));
    const store = useProfileStore.getState();
    expect(store.profiles.some(p => p.name === 'Support' && p.provider === 'outlook')).toBe(true);
  });

  it('edits an existing profile', () => {
    // seed
  const p = useProfileStore.getState().addProfile({ name: 'Test', userName: 'U', email: 'u@x.de', provider: 'imap', imapHost: 'mail.example.com', imapConfigured: true });
    renderWith('/');
    fireEvent.click(screen.getByText(/Bearbeiten/i));
    const nameInput = screen.getByDisplayValue('Test');
    fireEvent.change(nameInput, { target: { value: 'Test Neu' }});
    fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));
    const updated = useProfileStore.getState().profiles.find(x=>x.id===p.id)!;
    expect(updated.name).toBe('Test Neu');
  });

  it('edits imap fields and saves new password', () => {
    const p = useProfileStore.getState().addProfile({ name: 'Box', userName: 'U', email: 'u@example.com', provider: 'imap', imapHost: 'old.host', imapConfigured: true, imapPassword: 'old' });
    renderWith('/');
    fireEvent.click(screen.getByText(/Bearbeiten/i));
    fireEvent.change(screen.getByLabelText(/IMAP Host/i), { target: { value: 'new.host' }});
  fireEvent.change(screen.getByLabelText(/Neues Passwort \(optional\)/i), { target: { value: 'newpass' }});
    fireEvent.click(screen.getByLabelText(/Neues Passwort speichern/i));
  fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));
    const updated = useProfileStore.getState().profiles.find(x=>x.id===p.id)!;
    expect(updated.imapHost).toBe('new.host');
    expect(updated.imapPassword).toBe('newpass');
  });

  it('removes stored imap password', () => {
    const p = useProfileStore.getState().addProfile({ name: 'Secure', userName: 'U', email: 'u@example.com', provider: 'imap', imapHost: 'mail.host', imapConfigured: true, imapPassword: 'keep' });
    renderWith('/');
    fireEvent.click(screen.getByText(/Bearbeiten/i));
    fireEvent.click(screen.getByLabelText(/Gespeichertes Passwort entfernen/i));
  fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));
    const updated = useProfileStore.getState().profiles.find(x=>x.id===p.id)!;
    expect(updated.imapPassword).toBeUndefined();
  });

  it('delete requires confirmation', () => {
    useProfileStore.getState().addProfile({ name: 'ToDelete', userName: 'TD', email: 'td@example.com', provider: 'imap' });
    renderWith('/');
  const delBtn = screen.getByRole('button', { name: /Löschen/i });
    fireEvent.click(delBtn);
    expect(screen.getByText(/Sicher\?/i)).not.toBeNull();
    fireEvent.click(screen.getByText(/Sicher\?/i));
    expect(screen.queryByText('ToDelete')).toBeNull();
  });

  it('cancel edit returns without change', () => {
    const p = useProfileStore.getState().addProfile({ name: 'Original', userName: 'O', email: 'o@example.com', provider: 'imap' });
    renderWith('/');
  fireEvent.click(screen.getByRole('button', { name: /Bearbeiten/i }));
    const nameInput = screen.getByDisplayValue('Original');
    fireEvent.change(nameInput, { target: { value: 'Changed' }});
    fireEvent.click(screen.getByText(/Abbrechen/i));
  expect(screen.getAllByText('Original').length).toBeGreaterThan(0);
  });
});

describe('Profile edit legacy safety', () => {
  it('does not crash editing legacy profile with undefined fields', () => {
    // simulate legacy profile in store
    useProfileStore.setState({ profiles: [{ id: 'L1', name: undefined as any, userName: undefined as any, email: undefined as any, provider: undefined as any, createdAt: new Date().toISOString() }], activeId: 'L1' });

    render(
      <MemoryRouter initialEntries={['/profiles/L1/edit']}>
        <Routes>
          <Route path="/profiles/:id/edit" element={<ProfileEditPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Try to save directly
  fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));

    // Should show validation errors instead of crashing
    expect(screen.getByText(/Profilname fehlt/i)).not.toBeNull();
    expect(screen.getByText(/Benutzername fehlt/i)).not.toBeNull();
    expect(screen.getByText(/E-Mail fehlt/i)).not.toBeNull();
  });
});
