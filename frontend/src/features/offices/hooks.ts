"use client";

import { useEffect, useState } from "react";
import { listOffices, type ListOfficesParams } from "./api";
import type { GovernmentOffice } from "./types";

export interface UseOfficesResult {
  data: {
    items: GovernmentOffice[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
}

export function useOffices(params: ListOfficesParams = {}): UseOfficesResult {
  const [data, setData] = useState<UseOfficesResult["data"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    listOffices(params)
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