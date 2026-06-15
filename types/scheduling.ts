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

export interface AvailabilityMap {
  [dateKey: string]: string[];
}

export interface MeetingSchedulerProps {
  hostId?: string;
  meeting: MeetingDetails;
  availability?: AvailabilityMap;
  defaultTimezone?: string;
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (date: Date, time: string) => void;
}
