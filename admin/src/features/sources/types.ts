export interface Source {
  id: number;
  name: string;
  url: string;
  description: string | null;
  official: boolean;
  verified_at: string | null;
  checked_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceCreate {
  name: string;
  url: string;
  description?: string | null;
  official?: boolean;
  checked_by?: string | null;
}

export interface SourceUpdate {
  name?: string;
  url?: string;
  description?: string | null;
  official?: boolean;
  checked_by?: string | null;
}

export interface SourceVerify {
  checked_by: string;
}