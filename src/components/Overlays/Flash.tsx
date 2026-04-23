/**
 * The entry-flash overlay. Pure state → className mapping; the 0.4s
 * opacity transition is defined on `#flash` in index.css.
 */
export function Flash({ on }: { on: boolean }) {
  return <div id="flash" className={on ? 'on' : ''} />;
}
