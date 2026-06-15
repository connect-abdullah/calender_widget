import "server-only";
import { formatDateKey } from "@/lib/calendar-utils";
import {
  busyCacheKey,
  findCachedBusyForDate,
  getCachedBusy,
  setCachedBusy,
} from "@/lib/busy-cache";
import {
  buildMonthAvailability,
  fetchBusyPeriodsForRange,
  generateSlotsForDay,
} from "@/lib/google-calendar";
import { getHostById, hostToScheduleConfig } from "@/lib/hosts";
import type { DaySlots, MonthAvailabilityMap } from "@/types/scheduling";

async function getHostConfig(hostId: string) {
  const host = await getHostById(hostId);
  if (!host) {
    throw new Error("Host not found");
  }
  return hostToScheduleConfig(host);
}

async function getOrFetchBusyForRange(
  hostId: string,
  config: Awaited<ReturnType<typeof hostToScheduleConfig>>,
  start: string,
  end: string,
) {
  const key = busyCacheKey(hostId, start, end);
  const cached = getCachedBusy(key);
  if (cached) return cached;

  const busy = await fetchBusyPeriodsForRange(config, start, end);
  setCachedBusy(key, busy, start, end);
  return busy;
}

function monthRangeForDate(dateKey: string) {
  const [year, month] = dateKey.split("-").map(Number);
  const start = formatDateKey(new Date(year, month - 1, 1));
  const end = formatDateKey(new Date(year, month, 0));
  return { start, end };
}

export async function fetchHostMonthAvailability(
  hostId: string,
  start: string,
  end: string,
): Promise<MonthAvailabilityMap> {
  const config = await getHostConfig(hostId);
  const busy = await getOrFetchBusyForRange(hostId, config, start, end);
  return buildMonthAvailability(config, start, end, busy);
}

export async function fetchHostDaySlots(hostId: string, dateKey: string): Promise<DaySlots> {
  const config = await getHostConfig(hostId);

  let busy = findCachedBusyForDate(hostId, dateKey);
  if (!busy) {
    const { start, end } = monthRangeForDate(dateKey);
    busy = await getOrFetchBusyForRange(hostId, config, start, end);
  }

  return generateSlotsForDay(dateKey, config, busy);
}
