"use client";

import dynamic from "next/dynamic";
import type { GovernmentOffice } from "@/features/offices/types";

const OfficesMap = dynamic(() => import("./OfficesMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl border border-sand-200 bg-sand-50 flex items-center justify-center"
      style={{ height: "600px" }}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-egypt-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">جاري تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

interface OfficesMapWrapperProps {
  offices: GovernmentOffice[];
  height?: string;
}

export default function OfficesMapWrapper({
  offices,
  height = "600px",
}: OfficesMapWrapperProps) {
  return <OfficesMap offices={offices} height={height} />;
}