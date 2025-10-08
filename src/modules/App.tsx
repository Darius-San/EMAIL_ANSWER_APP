import React from 'react';
import { useEffect } from 'react';
import { ProfileSelection } from './profile/ProfileSelection';
import { BackendStatusBanner } from './layout/BackendStatusBanner';
import { Routes, Route } from 'react-router-dom';
import { ProfileSetupPage } from './profile/ProfileSetupPage';
import { ProfileEditPage } from './profile/ProfileEditPage';
import { ImapSetupPage } from './profile/ImapSetupPage';
import { ProfileInboxPage } from './profile/ProfileInboxPage';
import { useThemeStore } from '../store/themeStore';
import { DebugModeBanner } from './layout/DebugModeBanner';
import { TopBar } from './layout/TopBar';

export const App: React.FC = () => {
  const theme = useThemeStore(s => s.theme);
  const setTheme = useThemeStore(s => s.setTheme);
  useEffect(() => { setTheme(theme); }, []); // ensure attribute on first mount
  return (
    <div className="p-6 font-sans">
      {/* Global status & debug banners */}
      <BackendStatusBanner />
      <DebugModeBanner />
      {/* Primary navigation / profile & theme controls */}
      <TopBar />
      <Routes>
        <Route path="/" element={<ProfileSelection />} />
        <Route path="/profiles/new" element={<ProfileSetupPage />} />
  <Route path="/profiles/:id/edit" element={<ProfileEditPage />} />
  <Route path="/profiles/:id/inbox" element={<ProfileInboxPage />} />
        <Route path="/profiles/:id/setup" element={<ImapSetupPage />} />
      </Routes>
    </div>
  );
};
