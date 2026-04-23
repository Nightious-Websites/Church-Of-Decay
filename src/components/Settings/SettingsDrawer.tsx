import { useCallback, useEffect, useId, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import type { DisplayFont } from '../../lib/settings';

const DISPLAY_FONTS: readonly DisplayFont[] = ['UnifrakturCook', 'Cinzel', 'EB Garamond'];

export function SettingsDrawer() {
  const { settings, update, reset } = useSettings();
  const [open, setOpen] = useState(false);
  const ids = {
    hue: useId(),
    grain: useId(),
    fog: useId(),
    bpm: useId(),
    sig: useId(),
    font: useId(),
  };

  // Esc closes; body `inert` trick isn't great on iOS so we just manage focus return.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="settings-drawer"
        className="cod-drawer-toggle"
        title="Alter the veil"
      >
        <span aria-hidden="true">✦</span>
      </button>

      <aside
        id="settings-drawer"
        aria-label="Atmospheric settings"
        data-open={open}
        className="cod-drawer"
      >
        <header className="cod-drawer-head">
          <h2>Alter the Veil</h2>
          <button type="button" className="cod-drawer-close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="cod-drawer-body">
          <label htmlFor={ids.hue}>
            <span>Blood hue <em>{settings.bloodHue}°</em></span>
            <input
              id={ids.hue}
              type="range"
              min={-60}
              max={60}
              step={1}
              value={settings.bloodHue}
              onChange={(e) => update('bloodHue', Number(e.currentTarget.value))}
            />
          </label>

          <label htmlFor={ids.grain}>
            <span>Grain <em>{settings.grainOpacity.toFixed(2)}</em></span>
            <input
              id={ids.grain}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.grainOpacity}
              onChange={(e) => update('grainOpacity', Number(e.currentTarget.value))}
            />
          </label>

          <label htmlFor={ids.fog}>
            <span>Fog density <em>{settings.fogDensity.toFixed(2)}</em></span>
            <input
              id={ids.fog}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.fogDensity}
              onChange={(e) => update('fogDensity', Number(e.currentTarget.value))}
            />
          </label>

          <label htmlFor={ids.bpm}>
            <span>Heartbeat BPM <em>{settings.heartbeatBpm}</em></span>
            <input
              id={ids.bpm}
              type="range"
              min={48}
              max={120}
              step={1}
              value={settings.heartbeatBpm}
              onChange={(e) => update('heartbeatBpm', Number(e.currentTarget.value))}
            />
          </label>

          <label htmlFor={ids.sig} className="cod-drawer-toggle-row">
            <span>Show sigils</span>
            <input
              id={ids.sig}
              type="checkbox"
              checked={settings.showSigils}
              onChange={(e) => update('showSigils', e.currentTarget.checked)}
            />
          </label>

          <label htmlFor={ids.font}>
            <span>Display font</span>
            <select
              id={ids.font}
              value={settings.displayFont}
              onChange={(e) => update('displayFont', e.currentTarget.value as DisplayFont)}
            >
              {DISPLAY_FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>

        <footer className="cod-drawer-foot">
          <button type="button" className="cod-drawer-reset" onClick={reset}>Reset the rite</button>
        </footer>
      </aside>
    </>
  );
}
