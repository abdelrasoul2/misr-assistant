import { api } from "@/lib/api";
import type { EmergencyHotline, HotlineType } from "./types";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListHotlinesParams {
  page?: number;
  page_size?: number;
  hotline_type?: HotlineType;
  is_national?: boolean;
}

export async function listHotlines(
  params: ListHotlinesParams = {}
): Promise<PaginatedResponse<EmergencyHotline>> {
  const { data } = await api.get<PaginatedResponse<EmergencyHotline>>(
    "/hotlines",
    { params }
  );
  return data;
}