export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  is_active?: boolean;
}