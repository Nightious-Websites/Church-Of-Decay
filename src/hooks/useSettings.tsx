import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULTS, type Settings, applySettings } from '../lib/settings';

const STORAGE_KEY = 'cod_settings';
const PERSIST_DEBOUNCE_MS = 250;

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

interface SettingsContextValue {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: ProviderProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const persistTimer = useRef<number | undefined>(undefined);

  // Apply atmospheric changes immediately (cheap — uses cached DOM targets).
  // On first mount the body HTML may not be in the DOM yet; defer to rAF so
  // React has committed the `dangerouslySetInnerHTML` content before we query.
  useEffect(() => {
    const id = requestAnimationFrame(() => applySettings(settings));
    return () => cancelAnimationFrame(id);
  }, [settings]);

  // Persist on the trailing edge — a slider drag fires 60 events/sec and we
  // only need the final value stored. localStorage.setItem is sync + main-thread.
  // `pagehide` flushes any pending debounced value if the tab closes within the
  // 250ms window (more reliable than beforeunload on mobile Safari).
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // localStorage full / private-mode / blocked — non-fatal.
      }
    };
    clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(flush, PERSIST_DEBOUNCE_MS);
    const onPageHide = () => {
      clearTimeout(persistTimer.current);
      flush();
    };
    window.addEventListener('pagehide', onPageHide);
    return () => {
      clearTimeout(persistTimer.current);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [settings]);

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      // Referential equality short-circuit avoids a pointless render when a
      // slider fires input events while the rounded value hasn't moved.
      setSettings((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSettings(DEFAULTS);
  }, []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within <SettingsProvider>');
  return ctx;
}
