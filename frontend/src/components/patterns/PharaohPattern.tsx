interface PharaohPatternProps {
  className?: string;
  color?: string;
  height?: number;
}

export default function PharaohPattern({
  className = "",
  color = "#d4af37",
  height = 24,
}: PharaohPatternProps) {
  return (
    <div
      className={"w-full overflow-hidden pointer-events-none " + className}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pp" x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
            <path d="M 20 4 L 20 20 M 16 8 Q 20 12 24 8 M 14 12 Q 20 16 26 12" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M 0 20 L 5 12 L 10 20 Z M 30 20 L 35 12 L 40 20 Z" fill={color} opacity="0.4" />
          </pattern>
        </defs>
        <rect width="400" height="24" fill="url(#pp)" />
      </svg>
    </div>
  );
}
