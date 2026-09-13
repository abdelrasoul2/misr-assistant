import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { GovernmentOffice, OfficeType } from "./types";

export interface ListOfficesParams extends PaginationParams {
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
