import { formatDateKey } from "@/lib/calendar-utils";
import type { AvailabilityMap } from "@/types/scheduling";

export function availabilityQueryKey(hostId: string, year: number, month: number) {
  return ["availability", hostId, year, month] as const;
}

export function getMonthRange(year: number, month: number) {
  const start = formatDateKey(new Date(year, month, 1));
  const end = formatDateKey(new Date(year, month + 1, 0));
  return { start, end };
}

export async function fetchAvailabilityClient(
  hostId: string,
  year: number,
  month: number,
): Promise<AvailabilityMap> {
  const { start, end } = getMonthRange(year, month);
  const res = await fetch(`/api/availability/${hostId}?start=${start}&end=${end}`);

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to load availability");
  }

  return res.json() as Promise<AvailabilityMap>;
}
