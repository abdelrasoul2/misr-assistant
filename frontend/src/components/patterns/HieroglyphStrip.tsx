interface HieroglyphStripProps {
  className?: string;
}

const GLYPHS = ["𓀀", "𓆃", "𓅓", "𓊹", "𓊪", "𓇳", "𓃀", "𓎛"];

export default function HieroglyphStrip({ className = "" }: HieroglyphStripProps) {
  return (
    <div
      className={"flex items-center justify-center gap-3 text-pharaoh-gold/60 select-none " + className}
      aria-hidden="true"
    >
      {GLYPHS.map((g, i) => (
        <span key={i} className="text-lg leading-none">
          {g}
        </span>
      ))}
    </div>
  );
}
