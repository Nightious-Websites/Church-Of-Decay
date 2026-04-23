/** Decorative cross-and-circles divider; appears between major sections. */
export function GothicDivider() {
  return (
    <div className="gothic-divider" aria-hidden="true">
      <svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="3" x2="14" y2="25" stroke="#c41818" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="3" y1="14" x2="25" y2="14" stroke="#c41818" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="14" cy="3" r="2.2" fill="#c41818" />
        <circle cx="14" cy="25" r="2.2" fill="#c41818" />
        <circle cx="3" cy="14" r="2.2" fill="#c41818" />
        <circle cx="25" cy="14" r="2.2" fill="#c41818" />
        <circle cx="14" cy="14" r="3.5" fill="#c41818" />
      </svg>
    </div>
  );
}
