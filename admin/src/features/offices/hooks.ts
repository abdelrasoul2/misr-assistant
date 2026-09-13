import { useQuery } from "@tanstack/react-query";
import { listOffices, type ListOfficesParams } from "./api";

const KEY = "offices";

export function useOffices(params: ListOfficesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listOffices(params),
  });
}
