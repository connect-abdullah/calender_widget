import { DateTime } from "luxon";
import { isDayAvailable } from "@/lib/host-days";
import type { BusyPeriod } from "@/lib/busy-cache";
import { getCalendarForHost } from "@/lib/google-client";
import { formatDisplayTime, parseTimeString } from "@/lib/time-utils";
import type { BookingData } from "@/types/booking";
import type { HostScheduleConfig } from "@/types/host";
import type { MonthAvailabilityMap } from "@/types/scheduling";

function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

function parseTimeValue(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":").map(Number);
  return { hours: h, minutes: m };
}

export function toIsoDateTime(dateKey: string, time: string, timezone: string): string {
  const { hours, minutes } = parseTimeString(time);
  const { year, month, day } = parseDateKey(dateKey);

  return DateTime.fromObject(
    { year, month, day, hour: hours, minute: minutes, second: 0 },
    { zone: timezone },
  ).toFormat("yyyy-MM-dd'T'HH:mm:ss");
}

function slotToUtcRange(
  dateKey: string,
  hour: number,
  minute: number,
  timezone: string,
  durationMinutes: number,
): { start: number; end: number } {
  const { year, month, day } = parseDateKey(dateKey);
  const start = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: timezone },
  );
  const end = start.plus({ minutes: durationMinutes });
  return { start: start.toMillis(), end: end.toMillis() };
}

function overlapsBusy(slotStart: number, slotEnd: number, busy: BusyPeriod[]): boolean {
  return busy.some((b) => slotStart < b.end && slotEnd > b.start);
}

function enumerateDateKeys(startDate: string, endDate: string): string[] {
  const keys: string[] = [];
  let current = DateTime.fromISO(startDate, { zone: "utc" }).startOf("day");
  const end = DateTime.fromISO(endDate, { zone: "utc" }).startOf("day");

  while (current <= end) {
    keys.push(current.toFormat("yyyy-MM-dd"));
    current = current.plus({ days: 1 });
  }

  return keys;
}

export async function fetchBusyPeriodsForRange(
  config: HostScheduleConfig,
  startDate: string,
  endDate: string,
): Promise<BusyPeriod[]> {
  const rangeStart = DateTime.fromISO(startDate, { zone: config.timezone }).startOf("day");
  const rangeEnd = DateTime.fromISO(endDate, { zone: config.timezone }).endOf("day");

  const calendar = getCalendarForHost(config.refreshToken);
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: rangeStart.toUTC().toISO()!,
      timeMax: rangeEnd.toUTC().toISO()!,
      items: [{ id: config.calendarId }],
    },
  });

  const busy = response.data.calendars?.[config.calendarId]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({
      start: new Date(b.start!).getTime(),
      end: new Date(b.end!).getTime(),
    }));
}

export function isDayBookable(
  dateKey: string,
  config: HostScheduleConfig,
  busy: BusyPeriod[],
): boolean {
  const dateInTz = DateTime.fromISO(dateKey, { zone: config.timezone });
  if (!isDayAvailable(dateInTz.weekday, config.availableDays)) {
    return false;
  }

  const { hours: workStartHour, minutes: workStartMinute } = parseTimeValue(
    config.workingHoursStart,
  );
  const { hours: workEndHour, minutes: workEndMinute } = parseTimeValue(config.workingHoursEnd);

  const workStartMinutes = workStartHour * 60 + workStartMinute;
  const workEndMinutes = workEndHour * 60 + workEndMinute;
  const slotDuration = config.meetingDurationMinutes;

  for (let total = workStartMinutes; total + slotDuration <= workEndMinutes; total += slotDuration) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    const { start, end } = slotToUtcRange(
      dateKey,
      hour,
      minute,
      config.timezone,
      slotDuration,
    );

    if (!overlapsBusy(start, end, busy)) {
      return true;
    }
  }

  return false;
}

export function generateSlotsForDay(
  dateKey: string,
  config: HostScheduleConfig,
  busy: BusyPeriod[],
): string[] {
  const dateInTz = DateTime.fromISO(dateKey, { zone: config.timezone });
  if (!isDayAvailable(dateInTz.weekday, config.availableDays)) {
    return [];
  }

  const { hours: workStartHour, minutes: workStartMinute } = parseTimeValue(
    config.workingHoursStart,
  );
  const { hours: workEndHour, minutes: workEndMinute } = parseTimeValue(config.workingHoursEnd);

  const workStartMinutes = workStartHour * 60 + workStartMinute;
  const workEndMinutes = workEndHour * 60 + workEndMinute;
  const slotDuration = config.meetingDurationMinutes;

  const slots: string[] = [];

  for (let total = workStartMinutes; total + slotDuration <= workEndMinutes; total += slotDuration) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;

    const { start, end } = slotToUtcRange(
      dateKey,
      hour,
      minute,
      config.timezone,
      slotDuration,
    );

    if (!overlapsBusy(start, end, busy)) {
      slots.push(formatDisplayTime(hour, minute));
    }
  }

  return slots;
}

export function buildMonthAvailability(
  config: HostScheduleConfig,
  startDate: string,
  endDate: string,
  busy: BusyPeriod[],
): MonthAvailabilityMap {
  const availability: MonthAvailabilityMap = {};

  for (const dateKey of enumerateDateKeys(startDate, endDate)) {
    availability[dateKey] = isDayBookable(dateKey, config, busy);
  }

  return availability;
}

export async function isSlotAvailable(
  config: HostScheduleConfig,
  dateKey: string,
  time: string,
): Promise<boolean> {
  const dateInTz = DateTime.fromISO(dateKey, { zone: config.timezone });
  if (!isDayAvailable(dateInTz.weekday, config.availableDays)) {
    return false;
  }

  const { hours, minutes } = parseTimeString(time);
  const { start, end } = slotToUtcRange(
    dateKey,
    hours,
    minutes,
    config.timezone,
    config.meetingDurationMinutes,
  );

  const rangeStart = DateTime.fromMillis(start).minus({ minutes: 1 }).toUTC().toISO()!;
  const rangeEnd = DateTime.fromMillis(end).plus({ minutes: 1 }).toUTC().toISO()!;

  const busy = await fetchBusyPeriodsForRange(config, rangeStart.slice(0, 10), rangeEnd.slice(0, 10));
  return !overlapsBusy(start, end, busy);
}

export async function createBooking(
  config: HostScheduleConfig,
  data: BookingData,
): Promise<{ eventId: string }> {
  const calendar = getCalendarForHost(config.refreshToken);

  const available = await isSlotAvailable(config, data.date, data.time);
  if (!available) {
    throw new Error("This time slot is no longer available. Please choose another time.");
  }

  const startIso = toIsoDateTime(data.date, data.time, data.timezone);
  const { hours, minutes } = parseTimeString(data.time);
  const { year, month, day } = parseDateKey(data.date);
  const endDt = DateTime.fromObject(
    { year, month, day, hour: hours, minute: minutes },
    { zone: data.timezone },
  ).plus({ minutes: config.meetingDurationMinutes });
  const endIso = endDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

  const attendees = [
    { email: data.email, displayName: data.name },
    ...data.guests.map((email) => ({ email })),
  ];

  const response = await calendar.events.insert({
    calendarId: config.calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: config.meetingTitle ?? `${config.meetingDurationMinutes} Minute Meeting`,
      description: data.notes,
      start: { dateTime: startIso, timeZone: data.timezone },
      end: { dateTime: endIso, timeZone: data.timezone },
      attendees,
    },
  });

  const eventId = response.data.id;
  if (!eventId) {
    throw new Error("Failed to create calendar event");
  }

  return { eventId };
}
