import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../../store/profileStore';

interface EmailItem {
  id: string;
  subject: string;
  from: string;
  date?: string;
  snippet?: string;
  provider: string;
}

export const EmailList: React.FC = () => {
  const activeId = useProfileStore(s => s.activeId);
  const profile = useProfileStore(s => s.profiles.find(p => p.id === s.activeId));
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [host, setHost] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4410';

  async function fetchEmails(manual = false) {
    if (!profile) return;
    setLoading(true); setError(null);
    try {
      // Currently backend only supports env creds via GET; manual form is UX placeholder
  const qs = new URLSearchParams({ provider: profile.provider });
  const res = await fetch(`${apiBase}/api/emails?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { setEmails([]); if (profile) fetchEmails(); }, [activeId]);

  if (!profile) return <div className="text-sm text-gray-500">Kein aktives Profil ausgewählt.</div>;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <h3 className="text-xl font-semibold">E-Mails ({profile.name})</h3>
        <div className="flex gap-2">
          {profile.provider === 'imap' && (
            <button onClick={()=>setShowManual(s=>!s)} className="px-3 py-1 text-xs rounded border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface)]">
              {showManual ? 'Manuelle Daten ausblenden' : 'Manuelle IMAP Daten'}
            </button>
          )}
          <button onClick={()=>fetchEmails(showManual)} className="btn-warm btn-base text-sm">Aktualisieren</button>
        </div>
      </div>
      {showManual && profile.provider === 'imap' && (
        <div className="mb-4 p-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="imap-host" className="block text-xs font-medium mb-1">Host</label>
              <input id="imap-host" value={host} onChange={e=>setHost(e.target.value)} className="w-full px-2 py-1 rounded border bg-[var(--surface)] border-[var(--border)]" />
            </div>
            <div>
              <label htmlFor="imap-user" className="block text-xs font-medium mb-1">User</label>
              <input id="imap-user" value={user} onChange={e=>setUser(e.target.value)} className="w-full px-2 py-1 rounded border bg-[var(--surface)] border-[var(--border)]" />
            </div>
            <div>
              <label htmlFor="imap-pass" className="block text-xs font-medium mb-1">Passwort</label>
              <input id="imap-pass" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-2 py-1 rounded border bg-[var(--surface)] border-[var(--border)]" />
            </div>
          </div>
          <p className="text-[10px] text-gray-500">Hinweis: Passwörter werden nicht gespeichert – Funktionalität für dynamische Credentials folgt serverseitig.</p>
        </div>
      )}
      {loading && <div className="text-sm text-gray-500">Lade...</div>}
  {error && <div className="text-sm text-red-600">Fehler: {error} – Backend offline? (Basis: {apiBase})</div>}
      {!loading && emails.length === 0 && !error && (
        <div className="text-sm text-gray-500 border rounded p-4 bg-[var(--surface-alt)]">Keine E-Mails gefunden.</div>
      )}
      <ul className="space-y-2">
        {emails.map(m => (
          <li key={m.id} className="p-3 rounded border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface)] transition">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-medium line-clamp-1">{m.subject}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{m.from}</div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">{m.date ? new Date(m.date).toLocaleString() : ''}</div>
            </div>
            {m.snippet && <div className="text-xs mt-1 text-gray-600 line-clamp-2">{m.snippet}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};
