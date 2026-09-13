import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { Source, SourceCreate, SourceUpdate, SourceVerify } from "./types";

export interface ListSourcesParams extends PaginationParams {
  official?: boolean;
}

export async function listSources(
  params: ListSourcesParams = {}
): Promise<PaginatedResponse<Source>> {
  const { data } = await api.get<PaginatedResponse<Source>>("/sources", { params });
  return data;
}

export async function getSource(id: number): Promise<Source> {
  const { data } = await api.get<Source>(`/sources/${id}`);
  return data;
}

export async function createSource(payload: SourceCreate): Promise<Source> {
  const { data } = await api.post<Source>("/sources", payload);
  return data;
}

export async function updateSource(
  id: number,
  payload: SourceUpdate
): Promise<Source> {
  const { data } = await api.patch<Source>(`/sources/${id}`, payload);
  return data;
}

export async function verifySource(
  id: number,
  payload: SourceVerify
): Promise<Source> {
  const { data } = await api.post<Source>(`/sources/${id}/verify`, payload);
  return data;
}

export async function deleteSource(id: number): Promise<void> {
  await api.delete(`/sources/${id}`);
}