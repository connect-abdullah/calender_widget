import "server-only";
import { findCachedBusyForDate } from "@/lib/busy-cache";
import { getOrFetchBusyForRange, monthRangeForDate } from "@/lib/busy-fetch";
import {
  buildMonthAvailability,
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
