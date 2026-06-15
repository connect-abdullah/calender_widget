"use client";

import { useQuery } from "@tanstack/react-query";
import { availability as fallbackAvailability } from "@/constants/availability";
import {
  availabilityQueryKey,
  fetchAvailabilityClient,
} from "@/lib/queries/availability";
import type { AvailabilityMap } from "@/types/scheduling";

interface UseHostAvailabilityOptions {
  hostId?: string;
  year: number;
  month: number;
  initialAvailability?: AvailabilityMap;
  prefetchMonth?: { year: number; month: number };
}

export function useHostAvailability({
  hostId,
  year,
  month,
  initialAvailability,
  prefetchMonth,
}: UseHostAvailabilityOptions) {
  const isPrefetchMonth =
    prefetchMonth?.year === year && prefetchMonth?.month === month;

  return useQuery({
    queryKey: availabilityQueryKey(hostId ?? "", year, month),
    queryFn: () => fetchAvailabilityClient(hostId!, year, month),
    enabled: !!hostId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    initialData:
      isPrefetchMonth && initialAvailability ? initialAvailability : undefined,
    placeholderData: (previous) => previous,
  });
}

export function getAvailabilityWithFallback(
  data: AvailabilityMap | undefined,
  isError: boolean,
): { availability: AvailabilityMap; usedFallback: boolean } {
  if (data) return { availability: data, usedFallback: false };
  if (isError) return { availability: fallbackAvailability, usedFallback: true };
  return { availability: {}, usedFallback: false };
}
