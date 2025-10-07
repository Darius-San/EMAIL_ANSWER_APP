import React, { useEffect, useState } from 'react';

interface GlobalErr { message: string; stack?: string }

export const GlobalErrorOverlay: React.FC = () => {
  const [err, setErr] = useState<GlobalErr | null>(null);

  useEffect(() => {
    function onError(ev: ErrorEvent) {
      setErr({ message: ev.message, stack: ev.error?.stack });
    }
    function onRejection(ev: PromiseRejectionEvent) {
      const reason: any = ev.reason;
      setErr({ message: reason?.message || String(reason), stack: reason?.stack });
    }
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (!err) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-xl mx-auto bg-white text-black rounded shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Unerwarteter Fehler</h2>
        <div className="text-sm break-words whitespace-pre-wrap font-mono bg-gray-100 p-3 rounded max-h-64 overflow-auto">
          {err.message}\n{err.stack?.split('\n').slice(0,6).join('\n')}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={()=>setErr(null)} className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50">Schließen</button>
          <button onClick={()=>location.reload()} className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-500">Neu laden</button>
        </div>
      </div>
    </div>
  );
};
