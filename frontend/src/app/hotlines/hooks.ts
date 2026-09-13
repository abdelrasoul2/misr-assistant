"use client";

import { useEffect, useState } from "react";
import { listHotlines, type ListHotlinesParams } from "@/features/hotlines/api";
import type { EmergencyHotline } from "@/features/hotlines/types";

interface UseHotlinesResult {
  data: {
    items: EmergencyHotline[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
}

export function useHotlines(params: ListHotlinesParams = {}): UseHotlinesResult {
  const [data, setData] = useState<UseHotlinesResult["data"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    listHotlines(params)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params)]);

  return { data, isLoading, isError };
}