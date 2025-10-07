import React, { useEffect, useState } from 'react';

interface Props {
  apiBase?: string;
  intervalMs?: number;
}

export const BackendStatusBanner: React.FC<Props> = ({ apiBase = 'http://localhost:4410', intervalMs = 8000 }) => {
  const [status, setStatus] = useState<'ok'|'down'|'loading'>('loading');
  const [lastPort, setLastPort] = useState<number | null>(null);

  async function ping() {
    try {
      setStatus(prev => prev === 'ok' ? prev : 'loading');
      const res = await fetch(`${apiBase}/health`, { cache: 'no-store' });
      if (!res.ok) throw new Error('bad');
      const json = await res.json();
      if (json?.status === 'ok') {
        const portMatch = /:(\d+)/.exec(apiBase);
        setLastPort(portMatch ? parseInt(portMatch[1],10) : null);
        setStatus('ok');
      } else {
        setStatus('down');
      }
    } catch {
      setStatus('down');
    }
  }

  useEffect(() => {
    ping();
    const id = setInterval(ping, intervalMs);
    return () => clearInterval(id);
  }, [apiBase, intervalMs]);

  if (status === 'ok') return null;
  return (
    <div className={`mb-4 text-sm rounded border px-3 py-2 flex items-center gap-3 ${status==='down' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}> 
      {status === 'loading' && <span>Verbinde zum Backend...</span>}
      {status === 'down' && (
        <span>Backend nicht erreichbar. Läuft der Server? (Erwarteter Port {lastPort ?? '4410'}). Automatischer Retry läuft.</span>
      )}
    </div>
  );
};
