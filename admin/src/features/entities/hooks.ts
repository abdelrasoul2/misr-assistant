import { useQuery } from "@tanstack/react-query";
import { listEntities, type ListEntitiesParams } from "./api";

const KEY = "entities";

export function useEntities(params: ListEntitiesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listEntities(params),
  });
}
