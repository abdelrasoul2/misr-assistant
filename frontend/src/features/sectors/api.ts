import { api } from "@/lib/api";
import type { GovernmentEntity, Sector } from "./types";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listSectors(): Promise<Sector[]> {
  const { data } = await api.get<PaginatedResponse<Sector>>("/sectors", {
    params: { page: 1, page_size: 50 },
  });
  return data.items;
}

export async function getSector(id: number): Promise<Sector> {
  const { data } = await api.get<Sector>(`/sectors/${id}`);
  return data;
}

export async function listEntitiesBySector(
  sectorId: number
): Promise<GovernmentEntity[]> {
  const { data } = await api.get<PaginatedResponse<GovernmentEntity>>(
    "/entities",
    {
      params: { sector_id: sectorId, page: 1, page_size: 100 },
    }
  );
  return data.items;
}