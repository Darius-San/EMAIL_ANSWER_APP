import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TopBar } from './TopBar';
import { ProfileSelection } from '../profile/ProfileSelection';
import { ProfileInboxPage } from '../profile/ProfileInboxPage';
import { useProfileStore } from '../../store/profileStore';

function setupWithProfile() {
  useProfileStore.setState({ profiles: [], activeId: null });
  const p = useProfileStore.getState().addProfile({ name: 'VisibleTest', userName: 'U', email: 'u@test.de', provider: 'imap', imapHost: 'mail', imapConfigured: true, imapPassword: 'pw' });
  return p;
}

describe('TopBar conditional visibility', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  });

  it('shows title, theme buttons and new profile button only on root', () => {
    setupWithProfile();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><TopBar /><ProfileSelection /></>} />
          <Route path="/profiles/:id/inbox" element={<><TopBar /><ProfileInboxPage /></>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Email Responder/)).toBeInTheDocument();
    // Theme button example
    expect(screen.getByText(/Warm Modern/)).toBeInTheDocument();
    expect(screen.getByTestId('topbar-new-profile')).toBeInTheDocument();
  });

  it('hides title, theme buttons and profile list on inbox and shows back button', async () => {
    const p = setupWithProfile();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><TopBar /><ProfileSelection /></>} />
          <Route path="/profiles/:id/inbox" element={<><TopBar /><ProfileInboxPage /></>} />
        </Routes>
      </MemoryRouter>
    );
    // navigate to inbox
    fireEvent.click(screen.getByLabelText(/Profil VisibleTest aktivieren/i));
    // Title should be gone
    expect(screen.queryByText(/Email Responder/)).toBeNull();
    // Theme switcher hidden
    expect(screen.queryByText(/Warm Modern/)).toBeNull();
    // New profile button hidden
    expect(screen.queryByTestId('topbar-new-profile')).toBeNull();
    // Back button visible
    expect(screen.getByTestId('back-to-profiles')).toBeInTheDocument();
  });
});
