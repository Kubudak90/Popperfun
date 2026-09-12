export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6 0.6 7.3 4.2 11.2 4.4 8.2 6.8 9.3 10.6 6 8.6 2.7 10.6 3.8 6.8 0.8 4.4 4.7 4.2 6 0.6Z"
      />
    </svg>
  );
}

export function FlameIcon({ className }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6.2.8c.2 1.8 1.6 2.6 2.4 4 .9 1.4.6 3.2-.6 4.2-1.3 1.1-3.4 1-4.6-.3C2.2 7.3 2.1 5.4 3.2 4.2c.4 1.2 1.2 1.6 1.5 1.1.4-.7-.2-1.8.4-3 .3-.6.7-1.1 1.1-1.5Z"
      />
    </svg>
  );
}
