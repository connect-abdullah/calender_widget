export interface MeetingDetails {
  host: string;
  title: string;
  duration: number;
  description: string;
  meetingType?: "video" | "phone" | "in-person";
}

export interface TimezoneOption {
  id: string;
  label: string;
  offset: string;
}

/** Lightweight month view: date → bookable or not. */
export interface MonthAvailabilityMap {
  [dateKey: string]: boolean;
}

/** Day detail: available time slot labels. */
export type DaySlots = string[];

/** @deprecated Use MonthAvailabilityMap + DaySlots instead. */
export interface AvailabilityMap {
  [dateKey: string]: string[];
}

export interface MeetingSchedulerProps {
  hostId?: string;
  meeting: MeetingDetails;
  /** @deprecated use initialMonthAvailability */
  availability?: AvailabilityMap;
  /** @deprecated use initialMonthAvailability */
  initialAvailability?: AvailabilityMap;
  initialMonthAvailability?: MonthAvailabilityMap;
  prefetchMonth?: { year: number; month: number };
  defaultTimezone?: string;
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (date: Date, time: string) => void;
}
