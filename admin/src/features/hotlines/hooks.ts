import { useQuery } from "@tanstack/react-query";
import { listHotlines, type ListHotlinesParams } from "./api";

const KEY = "hotlines";

export function useHotlines(params: ListHotlinesParams = {}) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => listHotlines(params),
  });
}
