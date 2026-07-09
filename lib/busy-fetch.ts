import "server-only";
import { busyCacheKey, getCachedBusy, setCachedBusy, type BusyPeriod } from "@/lib/busy-cache";
import { fetchBusyPeriodsForRange } from "@/lib/google-calendar";
import type { HostScheduleConfig } from "@/types/host";

export function monthRangeForDate(dateKey: string): { start: string; end: string } {
  const [year, month] = dateKey.split("-").map(Number);
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

export async function getOrFetchBusyForRange(
  hostId: string,
  config: HostScheduleConfig,
  start: string,
  end: string,
): Promise<BusyPeriod[]> {
  const key = busyCacheKey(hostId, start, end);
  const cached = getCachedBusy(key);
  if (cached) return cached;

  const busy = await fetchBusyPeriodsForRange(config, start, end);
  setCachedBusy(key, busy, start, end);
  return busy;
}
