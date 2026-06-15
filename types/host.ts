export interface Host {
  id: string;
  name: string;
  timezone: string;
  meeting_duration_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
  available_days: number[];
  google_refresh_token: string;
  google_calendar_id: string;
  created_at: string;
}

export interface PublicHost {
  id: string;
  name: string;
  timezone: string;
  meeting_duration_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
  available_days: number[];
  google_calendar_id: string;
  created_at: string;
}

export interface NewHostPayload {
  name: string;
  timezone: string;
  meeting_duration_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
  available_days: number[];
}

export interface UpdateHostPayload {
  name: string;
  timezone: string;
  meeting_duration_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
  available_days: number[];
}

export interface HostScheduleConfig {
  timezone: string;
  meetingDurationMinutes: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  availableDays: number[];
  calendarId: string;
  refreshToken: string;
  meetingTitle?: string;
}
