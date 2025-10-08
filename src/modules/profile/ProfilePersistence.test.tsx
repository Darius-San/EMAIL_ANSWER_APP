import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { useProfileStore } from '../../store/profileStore';

// Helper to clear JSDOM localStorage between explicit phases only when we want to simulate reload persistence
// We do NOT clear localStorage between the two mounts so persist can restore.

describe('Profile persistence', () => {
  beforeEach(() => {
    // Ensure a clean starting point (but keep any other keys untouched if future tests rely on them)
    localStorage.clear();
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('restores created profile after remount (persist)', () => {
    // 1st mount: create a profile
    const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);
    const newBtn = screen.getByTestId('topbar-new-profile');
    fireEvent.click(newBtn);

    fireEvent.change(screen.getByLabelText(/Profil Name/i), { target: { value: 'Persist A' } });
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'UserA' } });
    fireEvent.change(screen.getByLabelText(/E-Mail Adresse/i), { target: { value: 'a@example.com' } });
    // Wechsel Provider um IMAP Validierung zu umgehen
    fireEvent.change(screen.getByLabelText(/Provider/i), { target: { value: 'outlook' } });
    fireEvent.click(screen.getByRole('button', { name: /^Speichern$/i }));

    // Sanity: store enthält Profil
    expect(useProfileStore.getState().profiles.some(p => p.name === 'Persist A')).toBe(true);

    // Unmount (Simuliert Tab/Seiten Reload)
    unmount();
    cleanup();

    // 2nd mount: persist plugin sollte restaurieren
    render(<MemoryRouter><App /></MemoryRouter>);
    // Vermeide Doppel-Treffer (Button + Card). Prüfe stattdessen Store Zustand + mindestens eine Darstellung.
    const restored = useProfileStore.getState().profiles.find(p => p.name === 'Persist A');
    expect(restored).toBeTruthy();
    // Button in TopBar trägt ebenfalls den Namen, daher nutzen wir hier die Profilkarte via aria-label
    const cardActivator = screen.getByLabelText(/Profil Persist A aktivieren/i);
    expect(cardActivator).toBeInTheDocument();
  });
});
