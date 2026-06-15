import "server-only";
import { getAvailability } from "@/lib/google-calendar";
import {
  availabilityCacheKey,
  getCachedAvailability,
  setCachedAvailability,
} from "@/lib/availability-cache";
import { getHostById, hostToScheduleConfig } from "@/lib/hosts";
import type { AvailabilityMap } from "@/types/scheduling";

export async function fetchHostAvailability(
  hostId: string,
  start: string,
  end: string,
): Promise<AvailabilityMap> {
  const key = availabilityCacheKey(hostId, start, end);
  const cached = getCachedAvailability(key);
  if (cached) return cached;

  const host = await getHostById(hostId);
  if (!host) {
    throw new Error("Host not found");
  }

  const config = hostToScheduleConfig(host);
  const availability = await getAvailability(config, start, end);
  setCachedAvailability(key, availability);
  return availability;
}
