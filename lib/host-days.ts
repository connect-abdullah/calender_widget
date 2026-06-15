/** ISO weekday: 1 = Monday, 7 = Sunday (matches Luxon DateTime.weekday) */
export const WEEKDAYS = [
  { value: 1, label: "Mon", fullLabel: "Monday" },
  { value: 2, label: "Tue", fullLabel: "Tuesday" },
  { value: 3, label: "Wed", fullLabel: "Wednesday" },
  { value: 4, label: "Thu", fullLabel: "Thursday" },
  { value: 5, label: "Fri", fullLabel: "Friday" },
  { value: 6, label: "Sat", fullLabel: "Saturday" },
  { value: 7, label: "Sun", fullLabel: "Sunday" },
] as const;

export const DEFAULT_AVAILABLE_DAYS = [1, 2, 3, 4, 5];

export function formatAvailableDays(days: number[]): string {
  if (days.length === 0) return "None";

  const sorted = [...days].sort((a, b) => a - b);
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  if (sorted.length === 7 && allDays.every((d, i) => sorted[i] === d)) {
    return "Every day";
  }
  if (sorted.length === 5 && sorted.every((d, i) => d === i + 1)) {
    return "Mon–Fri";
  }

  const labelByValue = Object.fromEntries(WEEKDAYS.map((d) => [d.value, d.label]));
  return sorted.map((d) => labelByValue[d] ?? String(d)).join(", ");
}

export function isDayAvailable(weekday: number, availableDays: number[]): boolean {
  return availableDays.includes(weekday);
}
