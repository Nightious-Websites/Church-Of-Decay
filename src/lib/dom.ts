/**
 * Re-trigger a CSS keyframe animation by removing the class, forcing a
 * synchronous layout flush via `offsetWidth`, and re-adding it. Without the
 * forced reflow the browser would coalesce remove+add into a no-op and the
 * animation would not restart.
 */
export function restartAnimation(el: Element, className: string): void {
  el.classList.remove(className);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
}
