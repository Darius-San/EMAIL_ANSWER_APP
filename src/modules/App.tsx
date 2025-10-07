import React from 'react';
import { useEffect } from 'react';
import { ProfileSelection } from './profile/ProfileSelection';
import { EmailList } from './email/EmailList';
import { BackendStatusBanner } from './layout/BackendStatusBanner';
import { TopBar } from './layout/TopBar';
import { Routes, Route } from 'react-router-dom';
import { ProfileSetupPage } from './profile/ProfileSetupPage';
import { ProfileEditPage } from './profile/ProfileEditPage';
import { useThemeStore } from '../store/themeStore';

export const App: React.FC = () => {
  const theme = useThemeStore(s => s.theme);
  const setTheme = useThemeStore(s => s.setTheme);
  useEffect(() => { setTheme(theme); }, []); // ensure attribute on first mount
  return (
    <div className="p-6 font-sans">
  <TopBar />
  <BackendStatusBanner />
      <Routes>
  <Route path="/" element={<><ProfileSelection /><EmailList /></>} />
        <Route path="/profiles/new" element={<ProfileSetupPage />} />
        <Route path="/profiles/:id/edit" element={<ProfileEditPage />} />
      </Routes>
    </div>
  );
};
