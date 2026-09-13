import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { Sector, SectorCreate, SectorUpdate } from "./types";

export interface ListSectorsParams extends PaginationParams {
  is_active?: boolean;
}

export async function listSectors(
  params: ListSectorsParams = {}
): Promise<PaginatedResponse<Sector>> {
  const { data } = await api.get<PaginatedResponse<Sector>>("/sectors", { params });
  return data;
}

export async function getSector(id: number): Promise<Sector> {
  const { data } = await api.get<Sector>(`/sectors/${id}`);
  return data;
}

export async function createSector(payload: SectorCreate): Promise<Sector> {
  const { data } = await api.post<Sector>("/sectors", payload);
  return data;
}

export async function updateSector(
  id: number,
  payload: SectorUpdate
): Promise<Sector> {
  const { data } = await api.patch<Sector>(`/sectors/${id}`, payload);
  return data;
}

export async function deleteSector(id: number): Promise<void> {
  await api.delete(`/sectors/${id}`);
}
