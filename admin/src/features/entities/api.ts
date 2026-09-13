import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { EntityType, GovernmentEntity } from "./types";

export interface ListEntitiesParams extends PaginationParams {
  sector_id?: number;
  governorate_id?: number;
  entity_type?: EntityType;
  is_active?: boolean;
}

export async function listEntities(
  params: ListEntitiesParams = {}
): Promise<PaginatedResponse<GovernmentEntity>> {
  const { data } = await api.get<PaginatedResponse<GovernmentEntity>>(
    "/entities",
    { params }
  );
  return data;
}
