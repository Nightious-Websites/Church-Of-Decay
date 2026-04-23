import { useCallback, useRef, useState } from 'react';
import { SettingsProvider } from './hooks/useSettings';
import { Creed } from './components/Creed';
import { Footer } from './components/Footer';
import { Gate } from './components/Gate/Gate';
import { GothicDivider } from './components/GothicDivider';
import { Hero } from './components/Hero';
import { Litany } from './components/Litany';
import { CursorDrips } from './components/Overlays/CursorDrips';
import { EmbersCanvas } from './components/Overlays/EmbersCanvas';
import { Flash } from './components/Overlays/Flash';
import { Portals } from './components/Portals';
import { Quill } from './components/Quill';
import { Ledger } from './components/Ritual/Ledger';
import { Stage } from './components/Stage/Stage';
import { Topbar } from './components/Topbar';
import { SettingsDrawer } from './components/Settings/SettingsDrawer';

const ENTERED_KEY = 'cod_entered';

function readEnteredFromSession(): boolean {
  try {
    return sessionStorage.getItem(ENTERED_KEY) === '1';
  } catch {
    return false;
  }
}

function AppShell() {
  const [entered, setEntered] = useState<boolean>(readEnteredFromSession);
  const [flashing, setFlashing] = useState(false);
  // Guards against a double-click on Enter re-firing the timed transition.
  const transitioningRef = useRef(false);
  // Refs lifted to the composition root so siblings can share DOM nodes
  // without cross-component queries: Ledger owns the stage, Quill reads its
  // rect for proximity; Quill owns the quill div, Ledger flashes its class.
  const ledgerStageRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);

  const onEnter = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    try {
      sessionStorage.setItem(ENTERED_KEY, '1');
    } catch {
      // Private mode / storage blocked — entry still proceeds in-memory.
    }
    setFlashing(true);
    window.setTimeout(() => {
      setEntered(true);
      window.setTimeout(() => {
        setFlashing(false);
        transitioningRef.current = false;
      }, 500);
    }, 350);
  }, []);

  return (
    <>
      <Gate entered={entered} onEnter={onEnter} />

      <Stage entered={entered}>
        <Topbar />
        <Hero />
        <Creed entered={entered} />
        <div className="gates-label">— The Four Gates Lie Open —</div>
        <Portals />
        <GothicDivider />
        <Ledger stageRef={ledgerStageRef} quillRef={quillRef} />
        <GothicDivider />
        <Litany />
      </Stage>

      <Footer />

      <Flash on={flashing} />
      <Quill quillRef={quillRef} ledgerStageRef={ledgerStageRef} />
      <CursorDrips />
      <EmbersCanvas />

      <SettingsDrawer />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}
