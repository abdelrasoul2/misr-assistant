"use client";

import { useEffect, useState } from "react";
import { searchServices, suggestSearch } from "./api";
import type { SearchResponse, SuggestResponse } from "./types";

export function useSearch(query: string, enabled: boolean = true) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setData(null);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      searchServices(query)
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
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { data, isLoading, isError };
}

export function useSuggestions(query: string) {
  const [data, setData] = useState<SuggestResponse | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setData(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      suggestSearch(query)
        .then((res) => {
          if (!cancelled) setData(res);
        })
        .catch(() => {});
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return data;
}