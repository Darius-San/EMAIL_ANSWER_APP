import React from 'react';
import { useDebugStore } from '../../store/debugStore';

export const DebugModeBanner: React.FC = () => {
  const enabled = useDebugStore(s => s.enabled);
  if (!enabled) return null;
  return (
    <div className="mb-4 text-xs rounded border px-3 py-2 flex items-center gap-3 bg-pink-50 border-pink-400 text-pink-700 shadow-sm" role="status" aria-label="Debug Mode Aktiv">
      <strong className="font-semibold tracking-wide">DEBUG MODE</strong>
      <span className="hidden sm:inline">Spezielle Entwicklungsfunktionen sichtbar. Nicht für Produktion gedacht.</span>
    </div>
  );
};
