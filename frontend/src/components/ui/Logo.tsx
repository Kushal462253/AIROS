interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AIROS logo"
    >
      <path
        d="M20 4L4 12L20 20L36 12L20 4Z"
        fill="url(#logo-gradient)"
        fillOpacity="0.9"
      />
      <path
        d="M4 20L20 28L36 20"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M4 28L20 36L36 28"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="4"
          y1="4"
          x2="36"
          y2="36"
        >
          <stop stopColor="#a5b4fc" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
