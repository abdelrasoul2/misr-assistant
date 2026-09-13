"use client";

import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { GovernmentOffice } from "@/features/offices/types";
import {
  OFFICE_TYPE_ICONS,
  OFFICE_TYPE_LABELS,
} from "@/features/offices/types";

interface OfficesMapProps {
  offices: GovernmentOffice[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Custom marker icon (avoid default icon path issue in Next.js)
function createIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #CE1126; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="transform: rotate(45deg); font-size: 14px;">📍</div></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function OfficesMap({
  offices,
  center,
  zoom = 6,
  height = "600px",
}: OfficesMapProps) {
  const validOffices = useMemo(
    () =>
      offices.filter(
        (o) =>
          o.latitude !== null &&
          o.longitude !== null &&
          o.latitude &&
          o.longitude
      ),
    [offices]
  );

  const defaultCenter: [number, number] = useMemo(() => {
    if (center) return center;
    return [26.8206, 30.8025]; // Egypt center
  }, [center]);

  return (
    <div
      className="rounded-2xl overflow-hidden border border-sand-200 shadow-sm"
      style={{ height }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validOffices.map((office) => {
          const lat = parseFloat(office.latitude as string);
          const lng = parseFloat(office.longitude as string);
          const icon = createIcon();

          return (
            <Marker key={office.id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="text-right" dir="rtl" style={{ minWidth: 200 }}>
                  <div style={{ fontSize: 24, textAlign: "center", marginBottom: 4 }}>
                    {OFFICE_TYPE_ICONS[office.office_type]}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      marginBottom: 4,
                      color: "#1a1a1a",
                    }}
                  >
                    {office.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
                    {OFFICE_TYPE_LABELS[office.office_type]}
                  </div>
                  <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>
                    📍 {office.address}
                  </div>
                  {office.phone && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#374151",
                        marginBottom: 6,
                      }}
                      dir="ltr"
                    >
                      📞 {office.phone}
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "6px 10px",
                      backgroundColor: "#CE1126",
                      color: "white",
                      borderRadius: 6,
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    🧭 الاتجاهات
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}