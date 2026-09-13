"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Governorate {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  region: string;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
}

export function useGovernorates() {
  const [data, setData] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ items: Governorate[]; total: number }>("/governorates", {
        params: { page: 1, page_size: 100 },
      })
      .then((res) => {
        if (!cancelled) {
          setData(res.data.items);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}

/**
 * يعيد قائمة المحافظات اللي عندها مكاتب حكومية.
 * نمرر له list of governorate IDs الموجودة في المكاتب.
 */
export function useGovernoratesWithOffices(officeGovIds: number[]) {
  const { data: governorates, isLoading } = useGovernorates();

  const withOffices = governorates.filter((g) => officeGovIds.includes(g.id));
  const withoutOffices = governorates.filter(
    (g) => !officeGovIds.includes(g.id)
  );

  return { withOffices, withoutOffices, isLoading };
}