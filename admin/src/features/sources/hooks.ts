import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSource,
  deleteSource,
  getSource,
  listSources,
  updateSource,
  verifySource,
  type ListSourcesParams,
} from "./api";
import type { SourceCreate, SourceUpdate, SourceVerify } from "./types";

const KEY = "sources";

export function useSources(params: ListSourcesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listSources(params),
  });
}

export function useSource(id: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => getSource(id as number),
    enabled: id !== null,
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SourceCreate) => createSource(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SourceUpdate }) =>
      updateSource(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useVerifySource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SourceVerify }) =>
      verifySource(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSource(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}