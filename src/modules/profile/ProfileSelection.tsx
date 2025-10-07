import React from 'react';

export const ProfileSelection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profil auswählen</h1>
  <p className="text-sm text-gray-600 mb-6">Wähle oder erstelle Profile über die Leiste oben. Provider-Einstellungen liegen jetzt pro Profil.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="p-4 border border-[var(--border)] rounded-lg bg-[var(--surface-alt)] h-32 flex items-center justify-center text-sm text-gray-500">
            Profil Slot {i}
          </div>
        ))}
      </div>
    </div>
  );
};
