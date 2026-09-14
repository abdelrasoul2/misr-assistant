import { api } from "@/lib/api";
import type { FullService, Service, ServiceStatus } from "./types";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListServicesParams {
  page?: number;
  page_size?: number;
  category_id?: number;
  status?: ServiceStatus;
  is_active?: boolean;
}

export async function listServices(
  params: ListServicesParams = {}
): Promise<PaginatedResponse<Service>> {
  const { data } = await api.get<PaginatedResponse<Service>>("/services", {
    params,
  });
  return data;
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const { data } = await api.get<Service>(`/services/by-slug/${slug}`);
  return data;
}

export async function getFullService(slug: string): Promise<FullService> {
  const { data } = await api.get<FullService>(
    `/services/by-slug/${slug}/full`
  );
  return data;
}