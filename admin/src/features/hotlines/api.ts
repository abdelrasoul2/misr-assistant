import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { EmergencyHotline, HotlineType } from "./types";

export interface ListHotlinesParams extends PaginationParams {
  hotline_type?: HotlineType;
  is_national?: boolean;
  governorate_id?: number;
  is_active?: boolean;
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
