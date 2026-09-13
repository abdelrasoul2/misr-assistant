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
  source_id: number | null;
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
  sewage: "صرف",
  consumer: "حماية المستهلك",
  health: "صحة",
  complaints: "شكاوى",
  roads: "طرق",
  other: "أخرى",
};
