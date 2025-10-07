import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileSelection } from './ProfileSelection';
import { ProfileSetupPage } from './ProfileSetupPage';
import { ProfileEditPage } from './ProfileEditPage';
import { useProfileStore } from '../../store/profileStore';

function renderWith(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/" element={<ProfileSelection />} />
        <Route path="/profiles/new" element={<ProfileSetupPage />} />
        <Route path="/profiles/:id/edit" element={<ProfileEditPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Profile CRUD', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('creates then lists profile card', () => {
  // navigate from root via button now
  renderWith('/');
  const newButtons = screen.getAllByText(/\+ Neues Profil/i);
  fireEvent.click(newButtons[0]);
    fireEvent.change(screen.getByLabelText(/Profil Name/i), { target: { value: 'Support' }});
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'Agent' }});
    fireEvent.change(screen.getByLabelText(/E-Mail Adresse/i), { target: { value: 'agent@example.com' }});
    fireEvent.click(screen.getByText(/Speichern/i));
  expect(screen.getAllByText('Support').length).toBeGreaterThan(0);
  });

  it('edits an existing profile', () => {
    // seed
    const p = useProfileStore.getState().addProfile({ name: 'Test', userName: 'U', email: 'u@x.de', provider: 'imap' });
    renderWith('/');
    fireEvent.click(screen.getByText(/Bearbeiten/i));
    const nameInput = screen.getByDisplayValue('Test');
    fireEvent.change(nameInput, { target: { value: 'Test Neu' }});
    fireEvent.click(screen.getByText(/^Speichern$/i));
  expect(screen.getAllByText('Test Neu').length).toBeGreaterThan(0);
  });

  it('delete requires confirmation', () => {
    useProfileStore.getState().addProfile({ name: 'ToDelete', userName: 'TD', email: 'td@example.com', provider: 'imap' });
    renderWith('/');
    const delBtn = screen.getByText(/Löschen/i);
    fireEvent.click(delBtn);
    expect(screen.getByText(/Sicher\?/i)).not.toBeNull();
    fireEvent.click(screen.getByText(/Sicher\?/i));
    expect(screen.queryByText('ToDelete')).toBeNull();
  });

  it('cancel edit returns without change', () => {
    const p = useProfileStore.getState().addProfile({ name: 'Original', userName: 'O', email: 'o@example.com', provider: 'imap' });
    renderWith('/');
    fireEvent.click(screen.getByText(/Bearbeiten/i));
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
    fireEvent.click(screen.getByText(/Speichern/i));

    // Should show validation errors instead of crashing
    expect(screen.getByText(/Profilname fehlt/i)).not.toBeNull();
    expect(screen.getByText(/Benutzername fehlt/i)).not.toBeNull();
    expect(screen.getByText(/E-Mail fehlt/i)).not.toBeNull();
  });
});
