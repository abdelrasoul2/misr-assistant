import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
  type ListCategoriesParams,
} from "./api";
import type { CategoryCreate, CategoryUpdate } from "./types";

const KEY = "categories";

export function useCategories(params: ListCategoriesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listCategories(params),
  });
}

export function useCategory(id: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => getCategory(id as number),
    enabled: id !== null,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryCreate) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryUpdate }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}