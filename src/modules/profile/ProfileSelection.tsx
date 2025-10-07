import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';

export const ProfileSelection: React.FC = () => {
  const profiles = useProfileStore(s => s.profiles);
  const activeId = useProfileStore(s => s.activeId);
  const setActive = useProfileStore(s => s.setActive);
  const removeProfile = useProfileStore(s => s.removeProfile);
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    removeProfile(id);
    setConfirmId(null);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button onClick={()=>navigate('/profiles/new')} className="px-4 py-2 text-sm rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)]">+ Neues Profil</button>
      </div>
      <p className="text-sm text-gray-600 mb-6">Aktive und gespeicherte Profile. Klicke einen Namen zum Aktivieren oder bearbeite Details.</p>
      {profiles.length === 0 && (
        <div className="p-6 rounded border border-dashed border-[var(--border)] text-center text-sm text-gray-500 bg-[var(--surface-alt)]">
          Noch keine Profile. Nutze "+ Neues Profil" oben.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map(p => {
          const isActive = p.id === activeId;
          return (
            <div key={p.id} className={`relative group rounded-xl border transition shadow-sm hover:shadow-md overflow-hidden ${isActive ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-1' : 'border-[var(--border)]'} bg-[var(--surface-alt)]`}> 
              <div className="p-4 space-y-2 cursor-pointer" onClick={() => setActive(p.id)} aria-label={`Profil ${p.name} aktivieren`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      {p.name}
                      {isActive && <span className="text-xs px-2 py-0.5 rounded bg-[var(--primary)] text-white">Aktiv</span>}
                    </h2>
                    <div className="text-xs text-gray-500">{p.email || 'Keine E-Mail'} • {(p.provider || 'imap').toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={(e)=>{e.stopPropagation(); navigate(`/profiles/${p.id}/edit`);}} className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface)]/70">Bearbeiten</button>
                  <button onClick={(e)=>{e.stopPropagation(); handleDelete(p.id);}} className={`px-2 py-1 text-xs rounded border ${confirmId===p.id? 'border-red-600 bg-red-600 text-white animate-pulse' : 'border-red-600 text-red-600 bg-[var(--surface)] hover:bg-red-600 hover:text-white'}`}>{confirmId===p.id? 'Sicher?' : 'Löschen'}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
