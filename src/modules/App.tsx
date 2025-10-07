import React from 'react';
import { ProviderSelector } from './provider/ProviderSelector';
import { EmailList } from './email/EmailList';

export const App: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Email Responder App</h1>
      <ProviderSelector />
      <EmailList />
    </div>
  );
};
