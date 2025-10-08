import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, ProfileProvider } from '../../store/profileStore';

export const ProfileSetupPage: React.FC = () => {
  const addProfile = useProfileStore(s => s.addProfile);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState<ProfileProvider>('imap');
  const [errors, setErrors] = useState<string[]>([]);
  // IMAP inline setup states
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState(993);
  const [imapSecure, setImapSecure] = useState(true);
  const [imapUser, setImapUser] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);

  // Keep imapUser in sync initially with email if empty
  useEffect(() => {
    if (!imapUser && email) setImapUser(email);
  }, [email]);

  function validate() {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Profilname fehlt');
    if (!userName.trim()) errs.push('Benutzername fehlt');
    if (!email.trim()) errs.push('E-Mail fehlt');
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.push('E-Mail Format ungültig');
    if (provider === 'imap') {
      if (!imapHost.trim()) errs.push('IMAP Host fehlt');
      if (!imapPort || imapPort <= 0 || imapPort > 65535) errs.push('IMAP Port ungültig');
      if (!imapUser.trim()) errs.push('IMAP Benutzer fehlt');
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const payload: any = { name, userName, email, provider };
    if (provider === 'imap') {
      Object.assign(payload, {
        imapHost: imapHost.trim(),
        imapPort,
        imapSecure,
        imapUser: imapUser.trim(),
        imapConfigured: true,
        imapPassword: savePassword ? imapPassword : undefined
      });
    }
    addProfile(payload);
    navigate('/');
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Neues Profil anlegen</h2>
      {errors.length > 0 && (
        <div className="mb-4 text-sm text-red-600 space-y-1">
          {errors.map(e => <div key={e}>{e}</div>)}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium mb-1">Profil Name</label>
          <input id="profile-name" aria-required="true" value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="profile-username" className="block text-sm font-medium mb-1">Benutzername</label>
          <input id="profile-username" aria-required="true" value={userName} onChange={e=>setUserName(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium mb-1">E-Mail Adresse</label>
          <input id="profile-email" aria-required="true" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="profile-provider" className="block text-sm font-medium mb-1">Provider</label>
          <select id="profile-provider" aria-required="true" value={provider} onChange={e=>setProvider(e.target.value as ProfileProvider)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]">
            <option value="imap">IMAP</option>
            <option value="outlook">Outlook</option>
            <option value="thunderbird">Thunderbird</option>
          </select>
        </div>
        {provider === 'imap' && (
          <div className="space-y-4 border rounded p-4 bg-[var(--surface-alt)] border-[var(--border)]">
            <div>
              <h3 className="text-sm font-semibold mb-1">IMAP Einstellungen</h3>
              <p className="text-xs text-gray-600">Host & Port deines Mailservers. Port 993 (SSL) ist Standard. Benutzer ist meist deine volle E-Mail Adresse.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="imap-host">IMAP Host</label>
                <input id="imap-host" value={imapHost} onChange={e=>setImapHost(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="imap-port">Port</label>
                <input id="imap-port" type="number" value={imapPort} onChange={e=>setImapPort(Number(e.target.value))} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input id="imap-secure" type="checkbox" checked={imapSecure} onChange={e=>setImapSecure(e.target.checked)} />
                <label htmlFor="imap-secure" className="text-xs font-medium">Sicher (SSL/TLS)</label>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="imap-user">IMAP Benutzer</label>
                <input id="imap-user" value={imapUser} onChange={e=>setImapUser(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" htmlFor="imap-pass">Passwort</label>
                <input id="imap-pass" type="password" value={imapPassword} onChange={e=>setImapPassword(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
                <div className="flex items-center gap-2 mt-2">
                  <input id="imap-save" type="checkbox" checked={savePassword} onChange={e=>setSavePassword(e.target.checked)} />
                  <label htmlFor="imap-save" className="text-[11px] text-gray-600">Passwort lokal speichern (nicht auf fremden Geräten)</label>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-500">Die IMAP Daten werden lokal im Browser persistiert. Passwort nur wenn Häkchen gesetzt.</div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} className="btn-warm btn-base">Speichern</button>
          <button onClick={()=>navigate('/')} className="px-4 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]">Abbrechen</button>
        </div>
      </div>
    </div>
  );
};
