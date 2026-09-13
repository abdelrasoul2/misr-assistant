"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

export default function AdSlot({
  slotId,
  format = "auto",
  className = "",
  label = "إعلان",
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // try {
    //   // @ts-ignore
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (e) {}
  }, []);

  const minHeight = format === "horizontal" ? 90 : format === "vertical" ? 600 : 250;

  return (
    <div className={"relative " + className}>
      <div className="absolute top-1 right-1 text-[10px] text-gray-400 uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded z-10">
        {label}
      </div>
      <div
        ref={adRef}
        className="w-full bg-gradient-to-l from-sand-50 to-sand-100 border border-dashed border-sand-300 rounded-xl flex items-center justify-center text-gray-400 text-sm"
        style={{ minHeight }}
        data-ad-slot={slotId}
        data-ad-format={format}
      >
        <div className="text-center">
          <div className="text-2xl mb-1 opacity-40">📰</div>
          <div className="text-xs opacity-60">مساحة إعلانية</div>
          <div className="text-[10px] mt-1 opacity-40">{slotId}</div>
        </div>
      </div>
    </div>
  );
}
