import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProfileSelection } from './ProfileSelection';
import { ProfileInboxPage } from './ProfileInboxPage';
import { useProfileStore } from '../../store/profileStore';

const originalFetch = global.fetch;

describe('Profile Inbox Navigation', () => {
  beforeEach(() => {
    global.fetch = async () => ({ ok: true, json: async () => ({ emails: Array.from({length:120}).map((_,i)=> ({ id: String(i+1), subject: 'Mail '+(i+1), from: 'a@b.de', provider: 'imap', date: new Date(Date.now() - i*1000).toISOString() })) }) }) as any;
    useProfileStore.setState({ profiles: [], activeId: null });
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('clicking configured imap profile navigates to inbox and limits to 100 newest', async () => {
    const p = useProfileStore.getState().addProfile({ name: 'InboxTest', userName: 'U', email: 'u@test.de', provider: 'imap', imapHost: 'mail.host', imapConfigured: true, imapPassword: 'pw' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProfileSelection />} />
          <Route path="/profiles/:id/inbox" element={<ProfileInboxPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Navigate by clicking card
  const card = screen.getByLabelText(/Profil InboxTest aktivieren/i);
  fireEvent.click(card);

  // Verwende findByText (implizites wait + act) statt custom waitFor mit direktem getByText
  await screen.findByText(/Posteingang - InboxTest/);

    // Expect newest mail (Mail 1) actually has highest timestamp; we reversed date so Mail 1 is newest in generator
    // After sorting desc and slicing 100, we should include id=1 and exclude id=120.
    expect(screen.getByText('Mail 1')).toBeInTheDocument();
    // Should not render the oldest beyond the 100 slice: there are 120 total, so 'Mail 120' must be absent.
    expect(screen.queryByText('Mail 120')).toBeNull();
    // Ensure exactly 100 rendered list items.
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(100);
  });

  it('clicking unconfigured imap profile routes to setup instead of inbox', async () => {
    const p = useProfileStore.getState().addProfile({ name: 'NeedSetup', userName: 'U', email: 'u@test.de', provider: 'imap', imapHost: 'mail.host', imapConfigured: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProfileSelection />} />
          <Route path="/profiles/:id/inbox" element={<ProfileInboxPage />} />
          <Route path="/profiles/:id/setup" element={<div>Setup Wizard</div>} />
        </Routes>
      </MemoryRouter>
    );

  const card = screen.getByLabelText(/Profil NeedSetup aktivieren/i);
  fireEvent.click(card);
    await waitFor(()=> screen.getByText(/Setup Wizard/));
    expect(screen.getByText('Setup Wizard')).toBeInTheDocument();
  });
});
