export interface Sector {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  color: string | null;
  sort_order: number;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GovernmentEntity {
  id: number;
  name: string;
  slug: string;
  short_name: string | null;
  entity_type:
    | "ministry"
    | "authority"
    | "agency"
    | "directorate"
    | "administration"
    | "council"
    | "other";
  sector_id: number | null;
  parent_id: number | null;
  governorate_id: number | null;
  source_id: number | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const ENTITY_TYPE_LABELS: Record<GovernmentEntity["entity_type"], string> = {
  ministry: "وزارة",
  authority: "هيئة",
  agency: "مصلحة",
  directorate: "مديرية",
  administration: "إدارة",
  council: "مجلس",
  other: "أخرى",
};