import React from 'react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { useProfileStore } from '../../store/profileStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const profiles = useProfileStore(s => s.profiles);
  const activeId = useProfileStore(s => s.activeId);
  const setActive = useProfileStore(s => s.setActive);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Email Responder</h1>
        <div className="flex-1" />
        <ThemeSwitcher />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {profiles.map(p => (
          <button key={p.id} onClick={() => setActive(p.id)}
            className={`px-3 py-1 rounded border text-sm ${activeId === p.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface-alt)] border-[var(--border)]'}`}>
            {p.name}
          </button>
        ))}
        {location.pathname !== '/profiles/new' && (
          <button onClick={() => navigate('/profiles/new')} className="px-3 py-1 rounded border text-sm bg-[var(--surface)] hover:bg-[var(--surface-alt)] border-dashed border-[var(--border)]">
            + Neues Profil
          </button>
        )}
      </div>
    </div>
  );
};
