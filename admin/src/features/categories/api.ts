import { api } from "../../api/client";
import type { PaginatedResponse, PaginationParams } from "../../types/api";
import type { Category, CategoryCreate, CategoryUpdate } from "./types";

export interface ListCategoriesParams extends PaginationParams {
  is_active?: boolean;
}

export async function listCategories(
  params: ListCategoriesParams = {}
): Promise<PaginatedResponse<Category>> {
  const { data } = await api.get<PaginatedResponse<Category>>("/categories", {
    params,
  });
  return data;
}

export async function getCategory(id: number): Promise<Category> {
  const { data } = await api.get<Category>(`/categories/${id}`);
  return data;
}

export async function createCategory(payload: CategoryCreate): Promise<Category> {
  const { data } = await api.post<Category>("/categories", payload);
  return data;
}

export async function updateCategory(
  id: number,
  payload: CategoryUpdate
): Promise<Category> {
  const { data } = await api.patch<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}