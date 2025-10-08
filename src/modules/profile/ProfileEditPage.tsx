import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore, ProfileProvider } from '../../store/profileStore';

export const ProfileEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = useProfileStore(s => s.profiles.find(p => p.id === id));
  const updateProfile = useProfileStore(s => s.updateProfile);
  const removeProfile = useProfileStore(s => s.removeProfile);
  const setActive = useProfileStore(s => s.setActive);
  // Use undefined initial values so we can distinguish "not yet loaded" vs empty string
  const [name, setName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [provider, setProvider] = useState<ProfileProvider>('imap');
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // IMAP fields
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState(993);
  const [imapSecure, setImapSecure] = useState(true);
  const [imapUser, setImapUser] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [removeStoredPassword, setRemoveStoredPassword] = useState(false);

  useEffect(() => {
    if (!profile) return; // redirect handled below
    // Defensive: normalize potential legacy undefined values
    setName(profile.name ?? '');
    setUserName(profile.userName ?? '');
    setEmail(profile.email ?? '');
    setProvider(profile.provider ?? 'imap');
    setImapHost(profile.imapHost || '');
    setImapPort(profile.imapPort || 993);
    setImapSecure(typeof profile.imapSecure === 'boolean' ? profile.imapSecure : true);
    setImapUser(profile.imapUser || profile.email || profile.userName || '');
    // editing: password field initially empty; user must re-enter to change or choose remove
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      navigate('/');
    }
  }, [profile, navigate]);

  function safeTrim(v: unknown): string {
    return typeof v === 'string' ? v.trim() : '';
  }

  function validate() {
    const errs: string[] = [];
    const n = safeTrim(name);
    const u = safeTrim(userName);
    const e = safeTrim(email);
    if (!n) errs.push('Profilname fehlt');
    if (!u) errs.push('Benutzername fehlt');
    if (!e) errs.push('E-Mail fehlt');
    if (e && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) errs.push('E-Mail Format ungültig');
    if (provider === 'imap') {
      if (!imapHost.trim()) errs.push('IMAP Host fehlt');
      if (!imapPort || imapPort <= 0 || imapPort > 65535) errs.push('IMAP Port ungültig');
      if (!imapUser.trim()) errs.push('IMAP Benutzer fehlt');
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!profile) return;
    if (!validate()) return;
    const update: any = { name, userName, email, provider };
    if (provider === 'imap') {
      Object.assign(update, {
        imapHost: imapHost.trim(),
        imapPort,
        imapSecure,
        imapUser: imapUser.trim(),
        imapConfigured: true
      });
      if (savePassword && imapPassword) {
        update.imapPassword = imapPassword;
      } else if (removeStoredPassword) {
        update.imapPassword = undefined; // remove
      }
    } else {
      // switching away from imap optionally could reset config flags
      Object.assign(update, { imapConfigured: false });
    }
    updateProfile(profile.id, update);
    setActive(profile.id);
    navigate('/');
  }

  function handleDelete() {
    if (!profile) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeProfile(profile.id);
    navigate('/');
  }

  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profil bearbeiten</h2>
      {errors.length > 0 && (
        <div className="mb-4 text-sm text-red-600 space-y-1">
          {errors.map(e => <div key={e}>{e}</div>)}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-profile-name" className="block text-sm font-medium mb-1">Profil Name</label>
          <input id="edit-profile-name" value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="edit-profile-username" className="block text-sm font-medium mb-1">Benutzername</label>
          <input id="edit-profile-username" value={userName} onChange={e=>setUserName(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="edit-profile-email" className="block text-sm font-medium mb-1">E-Mail Adresse</label>
          <input id="edit-profile-email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]" />
        </div>
        <div>
          <label htmlFor="edit-profile-provider" className="block text-sm font-medium mb-1">Provider</label>
          <select id="edit-profile-provider" value={provider} onChange={e=>setProvider(e.target.value as ProfileProvider)} className="w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]">
            <option value="imap">IMAP</option>
            <option value="outlook">Outlook</option>
            <option value="thunderbird">Thunderbird</option>
          </select>
        </div>
        {provider === 'imap' && (
          <div className="space-y-4 border rounded p-4 bg-[var(--surface-alt)] border-[var(--border)]">
            <div>
              <h3 className="text-sm font-semibold mb-1">IMAP Einstellungen</h3>
              <p className="text-xs text-gray-600">Bearbeite die gespeicherten IMAP Zugangsdaten. Passwort nur ändern wenn nötig.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="edit-imap-host">IMAP Host</label>
                <input id="edit-imap-host" value={imapHost} onChange={e=>setImapHost(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="edit-imap-port">Port</label>
                <input id="edit-imap-port" type="number" value={imapPort} onChange={e=>setImapPort(Number(e.target.value))} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input id="edit-imap-secure" type="checkbox" checked={imapSecure} onChange={e=>setImapSecure(e.target.checked)} />
                <label htmlFor="edit-imap-secure" className="text-xs font-medium">Sicher (SSL/TLS)</label>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="edit-imap-user">IMAP Benutzer</label>
                <input id="edit-imap-user" value={imapUser} onChange={e=>setImapUser(e.target.value)} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" htmlFor="edit-imap-pass">Neues Passwort (optional)</label>
                <input id="edit-imap-pass" type="password" value={imapPassword} onChange={e=>setImapPassword(e.target.value)} placeholder={profile.imapPassword ? 'Gespeichertes Passwort bleibt unverändert' : ''} className="w-full px-3 py-2 rounded border bg-[var(--surface)] border-[var(--border)]" />
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <label className="flex items-center gap-2 text-[11px] text-gray-600"><input type="checkbox" checked={savePassword} onChange={e=>{setSavePassword(e.target.checked); if (e.target.checked) setRemoveStoredPassword(false);}} /> Neues Passwort speichern</label>
                  {profile.imapPassword && !savePassword && (
                    <label className="flex items-center gap-2 text-[11px] text-gray-600"><input type="checkbox" checked={removeStoredPassword} onChange={e=>{setRemoveStoredPassword(e.target.checked); if (e.target.checked) setSavePassword(false);}} /> Gespeichertes Passwort entfernen</label>
                  )}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-500">Passwort wird nur gespeichert wenn explizit markiert. Entfernen löscht das gespeicherte Passwort lokal.</div>
          </div>
        )}
        <div className="flex gap-3 pt-2 flex-wrap">
          <button onClick={handleSave} className="btn-warm btn-base">Speichern</button>
          <button onClick={()=>navigate('/')} className="px-4 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]">Abbrechen</button>
          <button onClick={handleDelete} className={`px-4 py-2 rounded border text-sm ${confirmDelete ? 'bg-red-600 text-white border-red-600 animate-pulse' : 'bg-[var(--surface-alt)] border-red-600 text-red-600'}`}>
            {confirmDelete ? 'Wirklich löschen?' : 'Löschen'}
          </button>
        </div>
      </div>
    </div>
  );
};
