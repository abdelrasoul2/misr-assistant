export type OfficeType =
  | "civil_registry"
  | "traffic"
  | "passport"
  | "real_estate"
  | "tax"
  | "court"
  | "notary"
  | "municipality"
  | "post_office"
  | "health"
  | "education"
  | "police"
  | "other";

export interface GovernmentOffice {
  id: number;
  name: string;
  slug: string;
  office_type: OfficeType;
  entity_id: number | null;
  governorate_id: number;
  source_id: number | null;
  city: string | null;
  district: string | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  phone_alt: string | null;
  fax: string | null;
  email: string | null;
  working_hours: Record<string, string> | null;
  is_emergency: boolean;
  is_24_7: boolean;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const OFFICE_TYPE_LABELS: Record<OfficeType, string> = {
  civil_registry: "سجل مدني",
  traffic: "مرور",
  passport: "جوازات",
  real_estate: "شهر عقاري",
  tax: "ضرائب",
  court: "محكمة",
  notary: "توثيق",
  municipality: "محلية",
  post_office: "بريد",
  health: "صحة",
  education: "تعليم",
  police: "شرطة",
  other: "أخرى",
};
