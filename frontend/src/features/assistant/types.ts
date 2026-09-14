export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SuggestedService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
}

export interface AssistantRequest {
  message: string;
  history: ChatMessage[];
}

export interface AssistantResponse {
  reply: string;
  suggested_services: SuggestedService[];
  disclaimer: string;
}

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggested_services?: SuggestedService[];
  disclaimer?: string;
  timestamp: number;
}