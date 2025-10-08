import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TopBar } from './TopBar';
import { DebugModeBanner } from './DebugModeBanner';
import { useDebugStore } from '../../store/debugStore';

function renderUI() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<><TopBar /><DebugModeBanner /></>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Debug Mode', () => {
  beforeEach(() => {
    useDebugStore.setState({ enabled: false });
    cleanup();
  });

  it('toggles debug state and shows banner', () => {
    renderUI();
    const toggle = screen.getByTestId('debug-toggle');
    expect(screen.queryByText(/DEBUG MODE/i)).toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByText(/DEBUG MODE/i)).not.toBeNull();
    expect(useDebugStore.getState().enabled).toBe(true);
  });

  it('persists debug state across renders', () => {
    renderUI();
    fireEvent.click(screen.getByTestId('debug-toggle'));
    expect(useDebugStore.getState().enabled).toBe(true);
    cleanup();
    // re-render
    renderUI();
    expect(useDebugStore.getState().enabled).toBe(true);
    expect(screen.getByText(/DEBUG MODE/i)).not.toBeNull();
  });
});
