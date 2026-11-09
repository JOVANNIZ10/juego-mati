import type { ReactNode, SVGProps } from 'react';

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <Icon>
      <path d="M15 5l-7 7 7 7" />
    </Icon>
  );
}

export function ArrowRightIcon() {
  return (
    <Icon>
      <path d="M9 5l7 7-7 7" />
    </Icon>
  );
}

export function VolumeIcon() {
  return (
    <Icon>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />
      <path d="M16 9a4 4 0 0 1 0 6M18.8 6.5a8 8 0 0 1 0 11" />
    </Icon>
  );
}

export function MuteIcon() {
  return (
    <Icon>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </Icon>
  );
}

export function ReplayIcon() {
  return (
    <Icon>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4v4h4" />
    </Icon>
  );
}

export function TrashIcon() {
  return (
    <Icon>
      <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
    </Icon>
  );
}
