import React from 'react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { useProfileStore } from '../../store/profileStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebugStore } from '../../store/debugStore';

export const TopBar: React.FC = () => {
  const profiles = useProfileStore(s => s.profiles);
  const activeId = useProfileStore(s => s.activeId);
  const setActive = useProfileStore(s => s.setActive);
  const navigate = useNavigate();
  const location = useLocation();
  const debugEnabled = useDebugStore(s => s.enabled);
  const toggleDebug = useDebugStore(s => s.toggle);

  const isRoot = location.pathname === '/' || location.pathname.startsWith('/profiles') && location.pathname === '/profiles';
  const showFull = location.pathname === '/';
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {showFull ? (
          <h1 className="text-2xl font-bold">Email Responder</h1>
        ) : (
          <button onClick={()=>navigate('/')} className="px-3 py-1 rounded border text-sm bg-[var(--surface)] hover:bg-[var(--surface-alt)]" data-testid="back-to-profiles">Zurück zu Profilen</button>
        )}
        <div className="flex-1" />
        {showFull && <ThemeSwitcher />}
        <button
          onClick={toggleDebug}
          className={`px-3 py-1 rounded border text-xs font-medium tracking-wide ${debugEnabled ? 'bg-pink-600 text-white border-pink-600 ring-2 ring-pink-300' : 'bg-[var(--surface-alt)] border-[var(--border)] hover:bg-[var(--surface)]'}`}
          aria-pressed={debugEnabled}
          data-testid="debug-toggle"
        >
          {debugEnabled ? 'Debug ON' : 'Debug'}
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {showFull && profiles.map(p => (
          <button key={p.id} onClick={() => setActive(p.id)}
            className={`px-3 py-1 rounded border text-sm ${activeId === p.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface-alt)] border-[var(--border)]'}`}>
            {p.name}
          </button>
        ))}
        {showFull && location.pathname !== '/profiles/new' && (
          <button data-testid="topbar-new-profile" onClick={() => navigate('/profiles/new')} className="px-3 py-1 rounded border text-sm bg-[var(--surface)] hover:bg-[var(--surface-alt)] border-dashed border-[var(--border)]">
            + Neues Profil
          </button>
        )}
      </div>
    </div>
  );
};
