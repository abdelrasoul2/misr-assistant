import { api } from "@/lib/api";
import type {
  AISearchResponse,
  SearchResponse,
  SuggestResponse,
} from "./types";

export async function searchServices(
  q: string,
  limit: number = 20
): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/search", {
    params: { q, limit },
  });
  return data;
}

export async function searchServicesAI(
  q: string,
  explain: boolean = true
): Promise<AISearchResponse> {
  const { data } = await api.post<AISearchResponse>("/search/ai", {
    q,
    explain,
  });
  return data;
}

export async function suggestSearch(
  q: string,
  limit: number = 6
): Promise<SuggestResponse> {
  const { data } = await api.get<SuggestResponse>("/search/suggest", {
    params: { q, limit },
  });
  return data;
}