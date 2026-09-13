import { api } from "@/lib/api";
import type { GovernmentOffice, OfficeType } from "./types";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListOfficesParams {
  page?: number;
  page_size?: number;
  governorate_id?: number;
  office_type?: OfficeType;
  is_emergency?: boolean;
  is_active?: boolean;
}

export async function listOffices(
  params: ListOfficesParams = {}
): Promise<PaginatedResponse<GovernmentOffice>> {
  const { data } = await api.get<PaginatedResponse<GovernmentOffice>>(
    "/offices",
    { params }
  );
  return data;
}