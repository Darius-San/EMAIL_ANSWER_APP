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

  useEffect(() => {
    if (!profile) return; // redirect handled below
    // Defensive: normalize potential legacy undefined values
    setName(profile.name ?? '');
    setUserName(profile.userName ?? '');
    setEmail(profile.email ?? '');
    setProvider(profile.provider ?? 'imap');
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
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!profile) return;
    if (!validate()) return;
    updateProfile(profile.id, { name, userName, email, provider });
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
