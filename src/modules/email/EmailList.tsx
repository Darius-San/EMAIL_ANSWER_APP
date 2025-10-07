import React from 'react';
import { useEmailStore } from '../../store/emailStore';

export const EmailList: React.FC = () => {
  const emails = useEmailStore(s => s.emails);

  return (
    <div>
      <h2>E-Mails</h2>
      {emails.length === 0 && <p>Noch keine E-Mails geladen.</p>}
      <ul>
        {emails.map(m => (
          <li key={m.id}>
            <strong>{m.subject}</strong> von {m.from}
          </li>
        ))}
      </ul>
    </div>
  );
};
