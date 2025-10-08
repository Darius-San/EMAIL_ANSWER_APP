import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';

interface TestResult {
  ok: boolean;
  message: string;
  count?: number;
}

export const ImapSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = useProfileStore(s => s.profiles.find(p => p.id === id));
  const updateProfile = useProfileStore(s => s.updateProfile);
  const setActive = useProfileStore(s => s.setActive);

  const [host, setHost] = useState('');
  const [port, setPort] = useState(993);
  const [secure, setSecure] = useState(true);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4410';

  useEffect(() => {
    if (!profile) return;
    setHost(profile.imapHost || '');
    setPort(profile.imapPort || 993);
    setSecure(typeof profile.imapSecure === 'boolean' ? profile.imapSecure : true);
    setUser(profile.imapUser || profile.email || profile.userName || '');
  }, [profile]);

  useEffect(() => { if (!profile) navigate('/'); }, [profile, navigate]);

  function validate() {
    const errs: string[] = [];
    if (!host.trim()) errs.push('Host fehlt');
    if (!user.trim()) errs.push('Benutzername fehlt');
    if (!password.trim() && !profile?.imapPassword) errs.push('Passwort fehlt');
    if (!port || port <= 0 || port > 65535) errs.push('Port ungültig');
    setErrors(errs); return errs.length === 0;
  }

  async function handleTest() {
    if (!validate()) return;
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch(`${apiBase}/api/imap/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, secure, user, pass: password || profile?.imapPassword, limit: 3 })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setTestResult({ ok: true, message: 'Verbindung erfolgreich.', count: (data.emails || []).length });
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || 'Fehler' });
    } finally {
      setTesting(false);
    }
  }

  function handleSave() {
    if (!validate() || !profile) return;
    updateProfile(profile.id, {
      imapHost: host.trim(),
      imapPort: port,
      imapSecure: secure,
      imapUser: user.trim(),
      imapConfigured: true,
      imapPassword: savePassword ? password : undefined
    });
    setActive(profile.id);
    navigate('/');
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">IMAP Setup</h1>
        <p className="text-sm text-gray-600">Konfiguriere die Zugangsdaten für das Profil <span className="font-medium">{profile.name}</span>.</p>
      </div>

      <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] space-y-4">
        <div>
          <h2 className="font-semibold mb-2 text-sm uppercase tracking-wide">Kurze Anleitung</h2>
          <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
            <li>IMAP Host findest du meist in den Konto-Einstellungen deines Mail-Providers (z.B. imap.strato.de, imap.gmail.com).</li>
            <li>Port ist häufig 993 (SSL) oder 143 (StartTLS/Unverschlüsselt). Lass 993 wenn unsicher.</li>
            <li>"Sicher (SSL/TLS)" sollte aktiviert bleiben, außer dein Provider verlangt explizit eine unverschlüsselte Verbindung.</li>
            <li>Benutzername ist oft deine vollständige E-Mail Adresse.</li>
            <li>Für Gmail/Exchange kann ein App-Passwort nötig sein (2FA aktiv → App-Passwort generieren).</li>
            <li>Passwort wird lokal im Browser gespeichert wenn das Häkchen gesetzt ist (Risiko auf gemeinsam genutzten Rechnern!).</li>
          </ul>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-sm text-red-600 space-y-1">{errors.map(e=> <div key={e}>{e}</div>)}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1">IMAP Host</label>
          <input value={host} onChange={e=>setHost(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface-alt)] border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Port</label>
          <input type="number" value={port} onChange={e=>setPort(Number(e.target.value))} className="w-full px-3 py-2 rounded border bg-[var(--surface-alt)] border-[var(--border)]" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input id="imap-secure" type="checkbox" checked={secure} onChange={e=>setSecure(e.target.checked)} />
          <label htmlFor="imap-secure" className="text-xs font-medium">Sicher (SSL/TLS)</label>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Benutzername</label>
          <input value={user} onChange={e=>setUser(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface-alt)] border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Passwort</label>
          <input type="password" value={password} placeholder={profile.imapPassword ? 'Gespeichertes Passwort verwenden oder neu eingeben' : ''} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface-alt)] border-[var(--border)]" />
          <div className="flex items-center gap-2 mt-2">
            <input id="imap-save-pass" type="checkbox" checked={savePassword} onChange={e=>setSavePassword(e.target.checked)} />
            <label htmlFor="imap-save-pass" className="text-[11px] text-gray-600">Passwort lokal speichern (nicht empfohlen auf fremden Geräten)</label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={handleTest} disabled={testing} className="btn-base px-4 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)] hover:bg-[var(--surface)] text-sm">
          {testing ? 'Teste...' : 'Verbindung testen'}
        </button>
        <button onClick={handleSave} className="btn-warm btn-base text-sm">Speichern</button>
        <button onClick={()=>navigate('/')} className="px-4 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-sm">Abbrechen</button>
      </div>

      {testResult && (
        <div className={`p-3 rounded border text-sm ${testResult.ok ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
          {testResult.message}{testResult.ok && typeof testResult.count === 'number' ? ` (${testResult.count} Mail(s) Vorschau)` : ''}
        </div>
      )}

      <div className="text-[10px] text-gray-500 pt-4 border-t border-dashed border-[var(--border)]">
        Hinweis: Deine Zugangsdaten werden ausschließlich im Browser gespeichert und nur beim Abruf an den Server gesendet. Kein zentrales Speichern. Für maximale Sicherheit Passwort nicht dauerhaft speichern.
      </div>
    </div>
  );
};
