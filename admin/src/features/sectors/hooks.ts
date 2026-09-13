import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSector,
  deleteSector,
  getSector,
  listSectors,
  updateSector,
  type ListSectorsParams,
} from "./api";
import type { SectorCreate, SectorUpdate } from "./types";

const KEY = "sectors";

export function useSectors(params: ListSectorsParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listSectors(params),
  });
}

export function useSector(id: number | null) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => getSector(id as number),
    enabled: id !== null,
  });
}

export function useCreateSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SectorCreate) => createSector(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SectorUpdate }) =>
      updateSector(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSector(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
