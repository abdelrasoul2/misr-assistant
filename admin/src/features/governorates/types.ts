export interface Governorate {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  region: string;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
