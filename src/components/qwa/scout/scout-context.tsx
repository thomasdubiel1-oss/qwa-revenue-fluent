import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ScoutState } from '@/lib/scout/domain';
import { initialState } from '@/lib/scout/fixtures';
type ScoutContextValue = { state: ScoutState; update: (next: ScoutState) => void; notice: string; notify: (text: string) => void; };
const Context = createContext<ScoutContextValue | null>(null);
export function ScoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScoutState>(initialState);
  const [ready, setReady] = useState(false);
  const [notice, notify] = useState('');
  useEffect(() => {
    try { const raw = localStorage.getItem('qwa-demand-scout-demo-v1'); if (raw) { const parsed = JSON.parse(raw); if (parsed.version === 1 && Array.isArray(parsed.opportunities) && Array.isArray(parsed.events) && Array.isArray(parsed.drafts) && Array.isArray(parsed.outcomes)) setState(parsed); } } catch { notify('Demo storage is unavailable. Changes will last for this visit.'); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem('qwa-demand-scout-demo-v1',JSON.stringify(state)); } catch { /* Memory state stays usable when storage is blocked. */ } } }, [state, ready]);
  return <Context.Provider value={{ state, update: setState, notice, notify }}>{children}</Context.Provider>;
}
export function useScout() { const value = useContext(Context); if (!value) throw new Error('Demand Scout context is missing.'); return value; }
