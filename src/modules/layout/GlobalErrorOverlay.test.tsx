import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlobalErrorOverlay } from './GlobalErrorOverlay';

describe('GlobalErrorOverlay', () => {
  it('shows overlay on window error', () => {
    render(<GlobalErrorOverlay />);
    act(()=>{
      window.dispatchEvent(new ErrorEvent('error', { message: 'Window Boom' }));
    });
    expect(screen.getByText(/Window Boom/i)).not.toBeNull();
  });

  it('shows overlay on unhandled rejection', () => {
    render(<GlobalErrorOverlay />);
    act(()=>{
      const err = new Error('Promise Boom');
      // Create a rejected promise but attach a catch handler so the test runner
      // does not treat it as an unhandled rejection outside of our dispatched event.
      const p = Promise.reject(err);
      p.catch(()=>{}); // swallow to avoid global unhandled rejection noise
      window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', { promise: p, reason: err }));
    });
    expect(screen.getByText(/Promise Boom/i)).not.toBeNull();
  });
});
