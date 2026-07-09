import "server-only";

export interface BusyPeriod {
  start: number;
  end: number;
}

const TTL_MS = 300_000;

interface BusyCacheEntry {
  busy: BusyPeriod[];
  rangeStart: string;
  rangeEnd: string;
  expires: number;
}

const cache = new Map<string, BusyCacheEntry>();

export function busyCacheKey(hostId: string, start: string, end: string): string {
  return `${hostId}:${start}:${end}`;
}

export function getCachedBusy(key: string): BusyPeriod[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.busy;
}

export function setCachedBusy(
  key: string,
  busy: BusyPeriod[],
  rangeStart: string,
  rangeEnd: string,
): void {
  cache.set(key, { busy, rangeStart, rangeEnd, expires: Date.now() + TTL_MS });
}

export function findCachedBusyForDate(hostId: string, dateKey: string): BusyPeriod[] | null {
  const prefix = `${hostId}:`;

  for (const [key, entry] of cache) {
    if (!key.startsWith(prefix)) continue;
    if (Date.now() > entry.expires) {
      cache.delete(key);
      continue;
    }
    if (dateKey >= entry.rangeStart && dateKey <= entry.rangeEnd) {
      return entry.busy;
    }
  }

  return null;
}
