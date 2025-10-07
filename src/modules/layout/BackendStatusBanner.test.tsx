import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BackendStatusBanner } from './BackendStatusBanner';

describe('BackendStatusBanner', () => {
  it('shows loading then down', async () => {
  const originalFetch = global.fetch;
  global.fetch = (async () => { throw new Error('fail'); }) as any;
    render(<BackendStatusBanner apiBase="http://localhost:5999" intervalMs={50} />);
    expect(screen.getByText(/Verbinde zum Backend/i)).not.toBeNull();
    await waitFor(()=> screen.getByText(/Backend nicht erreichbar/i));
    global.fetch = originalFetch;
  });
});
