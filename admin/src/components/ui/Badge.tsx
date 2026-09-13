import type { ReactNode } from "react";

type Color = "gray" | "green" | "red" | "blue" | "gold";

interface BadgeProps {
  color?: Color;
  children: ReactNode;
}

const colorClasses: Record<Color, string> = {
  gray: "bg-sand-100 text-gray-700 border-sand-300",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-egypt-red-dark border-red-200",
  blue: "bg-pharaoh-blue/10 text-pharaoh-lapis border-pharaoh-blue/30",
  gold: "bg-gradient-to-l from-pharaoh-gold-light/50 to-pharaoh-gold/30 text-pharaoh-gold-dark border-pharaoh-gold/40 font-semibold",
};

export default function Badge({ color = "gray", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClasses[color],
      ].join(" ")}
    >
      {children}
    </span>
  );
}