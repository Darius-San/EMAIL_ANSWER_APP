import React from 'react';
import { useThemeStore } from '../../store/themeStore';

const themes = [
  { id: 'warm', label: 'Warm Modern', className: 'btn-warm' },
  { id: 'ocean', label: 'Calm Ocean', className: 'btn-ocean' },
  { id: 'earth', label: 'Earthy Minimal', className: 'btn-earth' },
  { id: 'sunset', label: 'Retro Sunset', className: 'btn-sunset' },
  { id: 'glass', label: 'Glass Frost', className: 'btn-glass' }
] as const;

export const ThemeSwitcher: React.FC = () => {
  const theme = useThemeStore(s => s.theme);
  const setTheme = useThemeStore(s => s.setTheme);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {themes.map(t => (
        <button
          key={t.id}
            data-active={theme === t.id}
            onClick={() => setTheme(t.id)}
            className={`${t.className} btn-base border border-transparent data-[active=true]:ring-2 data-[active=true]:ring-offset-2 data-[active=true]:ring-indigo-400`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};
