export interface SearchResultItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  match_type: "alias" | "name" | "description";
  match_score: number;
  matched_phrase: string | null;
}

export interface SearchResponse {
  query: string;
  normalized_query: string;
  total: number;
  items: SearchResultItem[];
}

export interface AISearchResponse extends SearchResponse {
  ai_explanation: string | null;
  ai_used: boolean;
  disclaimer: string;
}

export interface SuggestItem {
  text: string;
  type: "service" | "alias";
  service_id: number | null;
  service_slug: string | null;
}

export interface SuggestResponse {
  query: string;
  items: SuggestItem[];
}