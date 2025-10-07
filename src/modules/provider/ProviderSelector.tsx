import React from 'react';
import { useEmailStore } from '../../store/emailStore';

export const ProviderSelector: React.FC = () => {
  const provider = useEmailStore(s => s.provider);
  const setProvider = useEmailStore(s => s.setProvider);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ marginRight: '0.5rem' }}>Provider:</label>
      <select value={provider} onChange={(e) => setProvider(e.target.value as any)}>
        <option value="imap">IMAP</option>
        <option value="outlook">Outlook</option>
        <option value="thunderbird">Thunderbird</option>
      </select>
    </div>
  );
};
