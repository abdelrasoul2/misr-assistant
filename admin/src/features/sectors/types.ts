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

export interface SectorCreate {
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  color?: string | null;
  sort_order?: number;
  parent_id?: number | null;
  is_active?: boolean;
}

export interface SectorUpdate extends Partial<SectorCreate> {}
