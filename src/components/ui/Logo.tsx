export interface LogoProps {
  size?: number;
  className?: string;
}

/** Product mark: document icon with an orange folded corner and check badge. */
export function Logo({ size = 36, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        fill="#122e45"
        stroke="white"
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      <path d="M13 2V9H20L13 2Z" fill="#ff6b00" />
      <path
        d="M7 13H17M7 17H13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle cx="15" cy="15" r="4" fill="#ff6b00" />
      <path
        d="M14 15L15 16L17 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
