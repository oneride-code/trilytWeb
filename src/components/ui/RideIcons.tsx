/**
 * Line icons for the ride pages, drawn to match the design system's stroke
 * style (24px box, 1.5 stroke, round caps). Swap for the Figma icon exports
 * if you'd rather have them pixel-identical to the app set.
 */
type IconProps = { className?: string };

const base = "h-[22px] w-[22px] shrink-0";

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconCalendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const IconRoute = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 20c0-4 12-4 12-8S8 8 8 4" />
    <circle cx="8" cy="4" r="1.6" />
    <circle cx="6" cy="20" r="1.6" />
  </Svg>
);

export const IconTent = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4 3 19h18L12 4Z" />
    <path d="M12 4v15M8.5 19l3.5-6 3.5 6" />
  </Svg>
);

export const IconFlame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s5 4.2 5 8.6A5 5 0 0 1 7 12c0-1.6.7-2.9 1.6-4 .2 1.3.9 2.1 1.8 2.4C10.2 8 11 5.2 12 3Z" />
  </Svg>
);

export const IconMusic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="16" r="2" />
  </Svg>
);

export const IconUsers = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M17.5 14.9c2 .7 3.5 2.4 3.5 5.1" />
  </Svg>
);

export const IconSignal = (p: IconProps) => (
  <Svg {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
    <path d="M9.5 7.5a4 4 0 0 1 5 0M11 10a2 2 0 0 1 2 0" />
  </Svg>
);

export const IconWater = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s5.5 6.1 5.5 9.8A5.5 5.5 0 0 1 6.5 12.8C6.5 9.1 12 3 12 3Z" />
  </Svg>
);

export const IconPlate = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.5" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconMinus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 12h12" />
  </Svg>
);

export const IconTicket = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8.5V6.5a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 6.5v2a2.5 2.5 0 0 0 0 7v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-2a2.5 2.5 0 0 0 0-7Z" />
    <path d="M14 8.5v7" strokeDasharray="2 2.5" />
  </Svg>
);

export const IconBike = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="5.5" cy="17" r="3.5" />
    <circle cx="18.5" cy="17" r="3.5" />
    <path d="M5.5 17 10 8h4l3 9M9 8h7" />
  </Svg>
);
