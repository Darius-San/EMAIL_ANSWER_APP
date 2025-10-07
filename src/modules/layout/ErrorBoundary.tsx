import React from 'react';

interface State { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: any): State { return { hasError: true, message: err?.message || 'Unbekannter Fehler' }; }
  componentDidCatch(err: any, info: any) { console.error('Boundary caught error', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 border border-red-300 bg-red-50 rounded">
          <h2 className="font-bold mb-2 text-red-700">Render Fehler</h2>
          <p className="text-sm mb-4">{this.state.message}</p>
          <button onClick={()=>location.reload()} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Neu laden</button>
        </div>
      );
    }
    return this.props.children;
  }
}
