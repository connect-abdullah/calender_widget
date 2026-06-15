"use client";

import { useQuery } from "@tanstack/react-query";
import { monthAvailability as fallbackMonthAvailability, availability as fallbackDaySlots } from "@/constants/availability";
import {
  daySlotsQueryKey,
  fetchDaySlotsClient,
  fetchMonthAvailabilityClient,
  monthAvailabilityQueryKey,
} from "@/lib/queries/availability";
import type { DaySlots, MonthAvailabilityMap } from "@/types/scheduling";

interface UseHostMonthAvailabilityOptions {
  hostId?: string;
  year: number;
  month: number;
  initialMonthAvailability?: MonthAvailabilityMap;
  prefetchMonth?: { year: number; month: number };
}

export function useHostMonthAvailability({
  hostId,
  year,
  month,
  initialMonthAvailability,
  prefetchMonth,
}: UseHostMonthAvailabilityOptions) {
  const isPrefetchMonth =
    prefetchMonth?.year === year && prefetchMonth?.month === month;

  return useQuery({
    queryKey: monthAvailabilityQueryKey(hostId ?? "", year, month),
    queryFn: () => fetchMonthAvailabilityClient(hostId!, year, month),
    enabled: !!hostId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    initialData:
      isPrefetchMonth && initialMonthAvailability ? initialMonthAvailability : undefined,
    placeholderData: (previous) => previous,
  });
}

export function useDaySlots(hostId: string | undefined, dateKey: string | null) {
  return useQuery({
    queryKey: daySlotsQueryKey(hostId ?? "", dateKey ?? ""),
    queryFn: () => fetchDaySlotsClient(hostId!, dateKey!),
    enabled: !!hostId && !!dateKey,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function getMonthAvailabilityWithFallback(
  data: MonthAvailabilityMap | undefined,
  isError: boolean,
): { monthAvailability: MonthAvailabilityMap; usedFallback: boolean } {
  if (data) return { monthAvailability: data, usedFallback: false };
  if (isError) {
    return { monthAvailability: fallbackMonthAvailability, usedFallback: true };
  }
  return { monthAvailability: {}, usedFallback: false };
}

export function getDaySlotsWithFallback(
  data: DaySlots | undefined,
  isError: boolean,
  dateKey: string | null,
): { slots: DaySlots; usedFallback: boolean } {
  if (data) return { slots: data, usedFallback: false };
  if (isError && dateKey) {
    return { slots: fallbackDaySlots[dateKey] ?? [], usedFallback: true };
  }
  return { slots: [], usedFallback: false };
}
