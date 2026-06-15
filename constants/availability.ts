import type { AvailabilityMap, MonthAvailabilityMap } from "@/types/scheduling";

export const availability: AvailabilityMap = {
  "2026-06-17": [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ],
  "2026-06-18": ["10:00 AM", "11:00 AM", "1:00 PM"],
  "2026-06-20": ["9:00 AM", "9:30 AM", "10:00 AM", "2:00 PM", "4:00 PM"],
  "2026-06-24": ["11:00 AM", "11:30 AM", "12:00 PM", "3:00 PM"],
};

export const monthAvailability: MonthAvailabilityMap = Object.fromEntries(
  Object.keys(availability).map((dateKey) => [dateKey, true]),
);

export const DEFAULT_TIMEZONES = [
  {
    id: "Asia/Karachi",
    label: "Pakistan Standard Time",
    offset: "GMT+5",
  },
  {
    id: "America/New_York",
    label: "Eastern Time",
    offset: "GMT-4",
  },
  {
    id: "Europe/London",
    label: "British Summer Time",
    offset: "GMT+1",
  },
  {
    id: "America/Los_Angeles",
    label: "Pacific Time",
    offset: "GMT-7",
  },
  {
    id: "Asia/Tokyo",
    label: "Japan Standard Time",
    offset: "GMT+9",
  },
] as const;
