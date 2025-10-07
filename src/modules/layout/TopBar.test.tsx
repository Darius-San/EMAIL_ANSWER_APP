import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from './TopBar';
import { useProfileStore } from '../../store/profileStore';
import { useThemeStore } from '../../store/themeStore';

describe('TopBar', () => {
  beforeEach(() => {
    useProfileStore.setState({ profiles: [], activeId: null });
  useThemeStore.setState({ theme: 'warm', setTheme: (t: any) => {
      document.documentElement.setAttribute('data-theme', t);
      useThemeStore.setState({ theme: t });
    }} as any);
  });

  it('adds a new profile', () => {
    render(<TopBar />);
    const btn = screen.getByText(/Neues Profil/i);
    fireEvent.click(btn);
    expect(useProfileStore.getState().profiles.length).toBe(1);
  });

  it('switches theme when clicking a theme button', () => {
    render(<TopBar />);
    const ocean = screen.getByText(/Calm Ocean/i);
    fireEvent.click(ocean);
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
  });
});
