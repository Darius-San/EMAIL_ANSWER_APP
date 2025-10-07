import React from 'react';
import { useEffect } from 'react';
import { ProfileSelection } from './profile/ProfileSelection';
import { TopBar } from './layout/TopBar';
import { useThemeStore } from '../store/themeStore';

export const App: React.FC = () => {
  const theme = useThemeStore(s => s.theme);
  const setTheme = useThemeStore(s => s.setTheme);
  useEffect(() => { setTheme(theme); }, []); // ensure attribute on first mount
  return (
    <div className="p-6 font-sans">
      <TopBar />
      <ProfileSelection />
    </div>
  );
};
