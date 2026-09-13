import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { Governorate } from "./types";

export interface ListGovernoratesParams extends PaginationParams {
  region?: string;
}

export async function listGovernorates(
  params: ListGovernoratesParams = {}
): Promise<PaginatedResponse<Governorate>> {
  const { data } = await api.get<PaginatedResponse<Governorate>>(
    "/governorates",
    { params }
  );
  return data;
}
