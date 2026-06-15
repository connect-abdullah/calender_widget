import "server-only";
import type { AvailabilityMap } from "@/types/scheduling";

const TTL_MS = 60_000;

interface CacheEntry {
  data: AvailabilityMap;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

export function availabilityCacheKey(hostId: string, start: string, end: string): string {
  return `${hostId}:${start}:${end}`;
}

export function getCachedAvailability(key: string): AvailabilityMap | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedAvailability(key: string, data: AvailabilityMap): void {
  cache.set(key, { data, expires: Date.now() + TTL_MS });
}
