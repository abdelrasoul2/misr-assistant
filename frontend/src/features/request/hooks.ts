"use client";

import { useCallback, useEffect, useState } from "react";
import { loadProgress, loadRequestData, saveProgress, saveRequestData } from "./store";
import type { RequestData } from "./types";

export function useRequestData() {
  const [data, setData] = useState<RequestData | null>(null);

  useEffect(() => {
    setData(loadRequestData());
  }, []);

  const update = useCallback((next: RequestData) => {
    setData(next);
    saveRequestData(next);
  }, []);

  return { data, update };
}

export function useRequestProgress(serviceSlug: string) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(loadProgress(serviceSlug));
    setReady(true);
  }, [serviceSlug]);

  const toggle = useCallback(
    (stepId: string) => {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(stepId)) {
          next.delete(stepId);
        } else {
          next.add(stepId);
        }
        saveProgress(serviceSlug, next);
        return next;
      });
    },
    [serviceSlug]
  );

  const reset = useCallback(() => {
    const empty = new Set<string>();
    setDone(empty);
    saveProgress(serviceSlug, empty);
  }, [serviceSlug]);

  return { done, ready, toggle, reset };
}