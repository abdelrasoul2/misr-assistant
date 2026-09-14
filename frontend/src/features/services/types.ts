export type ServiceStatus =
  | "draft"
  | "under_review"
  | "verified"
  | "published"
  | "needs_review"
  | "outdated";

export type RequirementType = "required" | "optional" | "conditional";

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  eligibility: string | null;
  category_id: number;
  primary_source_id: number | null;
  official_url: string | null;
  status: ServiceStatus;
  last_verified_at: string | null;
  verified_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: number;
  service_id: number;
  source_id: number | null;
  title: string;
  description: string | null;
  requirement_type: RequirementType;
  condition_note: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: number;
  service_id: number;
  source_id: number | null;
  step_number: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fee {
  id: number;
  service_id: number;
  source_id: number;
  amount: string;
  currency: string;
  description: string | null;
  effective_from: string;
  effective_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  service_id: number;
  source_id: number | null;
  governorate: string;
  city: string | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  working_hours: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceAlias {
  id: number;
  service_id: number;
  phrase: string;
  normalized: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceQuestion {
  id: number;
  service_id: number;
  question: string;
  question_type: "boolean" | "single_choice" | "multiple_choice";
  help_text: string | null;
  sort_order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
  options: ServiceQuestionOption[];
}

export interface ServiceQuestionOption {
  id: number;
  question_id: number;
  label: string;
  value: string;
  sort_order: number;
}

export interface FullService {
  service: Service;
  requirements: Requirement[];
  steps: Step[];
  fees: Fee[];
  locations: Location[];
  aliases: ServiceAlias[];
  questions: ServiceQuestion[];
}

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  draft: "مسودة",
  under_review: "تحت المراجعة",
  verified: "تم التحقق",
  published: "منشور",
  needs_review: "يحتاج مراجعة",
  outdated: "قديم",
};

export const REQUIREMENT_TYPE_LABELS: Record<RequirementType, string> = {
  required: "مطلوب",
  optional: "اختياري",
  conditional: "مشروط",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "national-id": "🪪",
  passports: "🛂",
  traffic: "🚗",
  documents: "📄",
  education: "🎓",
  notary: "📝",
};