import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TopBar } from '../layout/TopBar';
import { ProfileSelection } from './ProfileSelection';
import { ProfileSetupPage } from './ProfileSetupPage';
import { ProfileEditPage } from './ProfileEditPage';
import { useProfileStore } from '../../store/profileStore';

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
    renderWith('/profiles/new');
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
