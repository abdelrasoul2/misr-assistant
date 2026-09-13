export type HotlineType =
  | "police"
  | "ambulance"
  | "fire"
  | "gas"
  | "water"
  | "electricity"
  | "sewage"
  | "consumer"
  | "health"
  | "complaints"
  | "roads"
  | "other";

export interface EmergencyHotline {
  id: number;
  name: string;
  number: string;
  hotline_type: HotlineType;
  description: string | null;
  sector_id: number | null;
  governorate_id: number | null;
  is_national: boolean;
  is_24_7: boolean;
  is_toll_free: boolean;
  priority: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const HOTLINE_TYPE_LABELS: Record<HotlineType, string> = {
  police: "شرطة",
  ambulance: "إسعاف",
  fire: "مطافئ",
  gas: "غاز",
  water: "مياه",
  electricity: "كهرباء",
  sewage: "صرف صحي",
  consumer: "حماية المستهلك",
  health: "صحة",
  complaints: "شكاوى",
  roads: "طرق",
  other: "أخرى",
};

export const HOTLINE_TYPE_ICONS: Record<HotlineType, string> = {
  police: "🚓",
  ambulance: "🚑",
  fire: "🚒",
  gas: "💨",
  water: "💧",
  electricity: "⚡",
  sewage: "🚰",
  consumer: "🛒",
  health: "🏥",
  complaints: "📢",
  roads: "🛣️",
  other: "📞",
};

export const HOTLINE_TYPE_COLORS: Record<HotlineType, string> = {
  police: "#0F172A",
  ambulance: "#DC2626",
  fire: "#EA580C",
  gas: "#CA8A04",
  water: "#0284C7",
  electricity: "#EAB308",
  sewage: "#0891B2",
  consumer: "#7C3AED",
  health: "#059669",
  complaints: "#B45309",
  roads: "#4338CA",
  other: "#6B7280",
};