import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const Boom: React.FC = () => { throw new Error('Explodiert'); };

describe('ErrorBoundary', () => {
  it('catches render error and shows UI', () => {
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/Render Fehler/i)).not.toBeNull();
    expect(screen.getByText(/Explodiert/i)).not.toBeNull();
  });
});
