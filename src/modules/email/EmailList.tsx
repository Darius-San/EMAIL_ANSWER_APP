import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../../store/profileStore';

export interface EmailItem {
  id: string;
  subject: string;
  from: string;
  date?: string;
  snippet?: string;
  provider: string;
}

interface EmailListProps {
  limit?: number;
}

export const EmailList: React.FC<EmailListProps> = ({ limit }) => {
  const activeId = useProfileStore(s => s.activeId);
  const profile = useProfileStore(s => s.profiles.find(p => p.id === s.activeId));
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [password, setPassword] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4410';

  async function fetchEmails() {
    if (!profile) return;
    setLoading(true); setError(null);
    try {
      if (profile.provider === 'imap' && profile.imapConfigured) {
        const body: any = {
          host: profile.imapHost,
          port: profile.imapPort || 993,
          secure: typeof profile.imapSecure === 'boolean' ? profile.imapSecure : true,
          user: profile.imapUser || profile.email,
          pass: password || profile.imapPassword,
          limit: limit || 15
        };
        if (!body.pass) {
          throw new Error('Kein Passwort eingegeben. (Setup Seite: optional speichern)');
        }
        const res = await fetch(`${apiBase}/api/imap/list`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        if (!res.ok) {
          const data = await res.json().catch(()=>({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        let list: EmailItem[] = data.emails || [];
        // defensive: sort desc by date if present
        list = list.sort((a,b)=> (new Date(b.date||0).getTime()) - (new Date(a.date||0).getTime()));
        if (limit) list = list.slice(0, limit);
        setEmails(list);
      } else {
        // fallback: legacy GET (env based)
        const qs = new URLSearchParams({ provider: profile.provider });
        const res = await fetch(`${apiBase}/api/emails?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let list: EmailItem[] = data.emails || [];
        list = list.sort((a,b)=> (new Date(b.date||0).getTime()) - (new Date(a.date||0).getTime()));
        if (limit) list = list.slice(0, limit);
        setEmails(list);
      }
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { setEmails([]); if (profile) fetchEmails(); }, [activeId]);

  if (!profile) return <div className="text-sm text-gray-500">Kein aktives Profil ausgewählt.</div>;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <h3 className="text-xl font-semibold">E-Mails ({profile.name})</h3>
        <div className="flex gap-2">
          {profile.provider === 'imap' && profile.imapConfigured && !profile.imapPassword && (
            <button onClick={()=>setShowManual(s=>!s)} className="px-3 py-1 text-xs rounded border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface)]">
              {showManual ? 'Passwort-Feld ausblenden' : 'Passwort eingeben'}
            </button>
          )}
          <button onClick={()=>fetchEmails()} className="btn-warm btn-base text-sm">Aktualisieren</button>
        </div>
      </div>
      {profile.provider === 'imap' && !profile.imapConfigured && (
        <div className="mb-4 p-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-xs text-gray-600">
          IMAP Setup unvollständig. <a href={`#/profiles/${profile.id}/setup`} className="text-[var(--primary)] underline">Jetzt konfigurieren</a> um Mails abzurufen.
        </div>
      )}
      {showManual && profile.provider === 'imap' && profile.imapConfigured && !profile.imapPassword && (
        <div className="mb-4 p-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] space-y-2">
          <div>
            <label htmlFor="imap-pass" className="block text-xs font-medium mb-1">Passwort (wird nicht gespeichert)</label>
            <input id="imap-pass" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-2 py-1 rounded border bg-[var(--surface)] border-[var(--border)]" />
            <p className="text-[10px] text-gray-500 mt-1">Eingabe erforderlich bei jedem Laden wenn nicht gespeichert.</p>
          </div>
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
