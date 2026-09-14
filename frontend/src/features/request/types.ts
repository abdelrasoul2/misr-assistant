export interface RequestData {
  full_name: string;
  national_id: string;
  address: string;
  phone: string;
  email?: string;
}

export const EMPTY_REQUEST_DATA: RequestData = {
  full_name: "",
  national_id: "",
  address: "",
  phone: "",
  email: "",
};

export interface FillStep {
  id: string;
  title: string;
  description?: string;
  copy_field?: keyof RequestData;
  external_url?: string;
  instruction?: string;
}

export interface ServiceFillGuide {
  service_slug: string;
  service_name: string;
  official_url?: string;
  official_url_label?: string;
  steps: FillStep[];
  notes?: string[];
}