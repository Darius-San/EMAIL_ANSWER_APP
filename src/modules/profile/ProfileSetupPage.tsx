import React, { useState } from 'react';
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

  function validate() {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Profilname fehlt');
    if (!userName.trim()) errs.push('Benutzername fehlt');
    if (!email.trim()) errs.push('E-Mail fehlt');
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.push('E-Mail Format ungültig');
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    addProfile({ name, userName, email, provider });
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
        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} className="btn-warm btn-base">Speichern</button>
          <button onClick={()=>navigate('/')} className="px-4 py-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]">Abbrechen</button>
        </div>
      </div>
    </div>
  );
};
