import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useThemeStore } from '../../store/themeStore';

describe('ThemeSwitcher', () => {
  it('renders all theme buttons and switches theme', () => {
    render(<ThemeSwitcher />);
    const warmBtn = screen.getByText(/Warm Modern/i);
    const oceanBtn = screen.getByText(/Calm Ocean/i);
    const earthBtn = screen.getByText(/Earthy Minimal/i);
    const sunsetBtn = screen.getByText(/Retro Sunset/i);
    const glassBtn = screen.getByText(/Glass Frost/i);
  expect(warmBtn).not.toBeNull();
  expect(oceanBtn).not.toBeNull();
  expect(earthBtn).not.toBeNull();
  expect(sunsetBtn).not.toBeNull();
  expect(glassBtn).not.toBeNull();

    fireEvent.click(oceanBtn);
    expect(useThemeStore.getState().theme).toBe('ocean');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');
  });
});
