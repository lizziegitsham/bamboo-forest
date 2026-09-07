type IconProps = { className?: string };

const base = "h-10 w-10";

export function FlexibilityIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className}>
      <path d="M4 19c4-1 4-6 8-8s6 1 8-2" />
      <circle cx="4" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="20" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StrengthIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className}>
      <rect x="2" y="9" width="4" height="6" rx="1" />
      <rect x="18" y="9" width="4" height="6" rx="1" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

export function BalanceIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v13" />
      <path d="M4 16h16" />
      <path d="M4 16l3-6 3 6" />
      <path d="M14 16l3-6 3 6" />
      <path d="M9 21h6" />
    </svg>
  );
}

export function StructureIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <ellipse cx="12" cy="19.5" rx="7" ry="1.8" />
      <ellipse cx="12" cy="14.5" rx="5.4" ry="1.6" />
      <ellipse cx="12" cy="10" rx="3.8" ry="1.5" />
      <ellipse cx="12" cy="6" rx="2.4" ry="1.3" />
    </svg>
  );
}

export function FocusIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function RelaxationIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className}>
      <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

export function AwarenessIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M12 3a9 9 0 0 1 0 18 4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 0 0-9z"
        fill="white"
      />
      <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="12" cy="16.5" r="1.3" fill="white" />
    </svg>
  );
}

export function FlowIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className}>
      <path d="M12 3a9 9 0 1 1 -6.4 15.3" />
    </svg>
  );
}
