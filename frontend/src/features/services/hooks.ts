"use client";

import { useEffect, useState } from "react";
import {
  getFullService,
  listServices,
  type ListServicesParams,
} from "./api";
import type { FullService, Service } from "./types";

export function useServices(params: ListServicesParams = {}) {
  const [data, setData] = useState<{
    items: Service[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    listServices(params)
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

export function useFullService(slug: string | null) {
  const [data, setData] = useState<FullService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    getFullService(slug)
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
  }, [slug]);

  return { data, isLoading, isError };
}