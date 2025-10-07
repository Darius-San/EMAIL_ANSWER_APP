import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { EmailList } from './EmailList';
import { useProfileStore } from '../../store/profileStore';

// Mock fetch
const originalFetch = global.fetch;

function setupWithProfile() {
  useProfileStore.setState({ profiles: [], activeId: null });
  const p = useProfileStore.getState().addProfile({ name: 'Mail', userName: 'U', email: 'u@test.de', provider: 'imap' });
  useProfileStore.setState({ activeId: p.id });
  return p;
}

describe('EmailList', () => {
  beforeEach(() => {
    global.fetch = async () => ({ ok: true, json: async () => ({ emails: [{ id: '1', subject: 'Hallo', from: 'a@b.de', provider: 'imap', snippet: 'Test', date: new Date().toISOString() }] }) }) as any;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('shows placeholder when no active profile', () => {
    useProfileStore.setState({ profiles: [], activeId: null });
    render(<EmailList />);
    expect(screen.getByText(/Kein aktives Profil/i)).not.toBeNull();
  });

  it('fetches and shows emails for active profile', async () => {
    setupWithProfile();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<EmailList />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(()=> screen.getByText('Hallo'));
    expect(screen.getByText('Hallo')).not.toBeNull();
  });
});
