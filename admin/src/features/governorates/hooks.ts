import { useQuery } from "@tanstack/react-query";
import { listGovernorates, type ListGovernoratesParams } from "./api";

const KEY = "governorates";

export function useGovernorates(params: ListGovernoratesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listGovernorates(params),
  });
}
