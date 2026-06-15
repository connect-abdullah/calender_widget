import { DateTime } from "luxon";
import { getCalendar, getGoogleCalendarId, getGoogleTimezone } from "@/lib/google-client";
import { formatDisplayTime, parseTimeString } from "@/lib/time-utils";
import type { BookingData } from "@/types/booking";
import type { AvailabilityMap } from "@/types/scheduling";

const WORK_START = 9;
const WORK_END = 17;
const SLOT_DURATION = 30;
const MEETING_DURATION = 30;

interface BusyPeriod {
  start: number;
  end: number;
}

function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
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

async function fetchBusyPeriods(
  timeMin: string,
  timeMax: string,
  calendarId: string,
): Promise<BusyPeriod[]> {
  const calendar = getCalendar();
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    },
  });

  const busy = response.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({
      start: new Date(b.start!).getTime(),
      end: new Date(b.end!).getTime(),
    }));
}

function generateSlotsForDay(
  dateKey: string,
  timezone: string,
  busy: BusyPeriod[],
): string[] {
  const slots: string[] = [];

  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
      const slotEndHour = hour + (minute + SLOT_DURATION) / 60;
      const slotEndMinute = (minute + SLOT_DURATION) % 60;
      const slotEndHourInt = Math.floor(slotEndHour);
      if (slotEndHourInt > WORK_END || (slotEndHourInt === WORK_END && slotEndMinute > 0)) {
        continue;
      }

      const { start, end } = slotToUtcRange(dateKey, hour, minute, timezone, SLOT_DURATION);
      if (!overlapsBusy(start, end, busy)) {
        slots.push(formatDisplayTime(hour, minute));
      }
    }
  }

  return slots;
}

export async function getAvailability(
  startDate: string,
  endDate: string,
  timezone?: string,
): Promise<AvailabilityMap> {
  const tz = timezone ?? getGoogleTimezone();
  const calendarId = getGoogleCalendarId();

  const rangeStart = DateTime.fromISO(startDate, { zone: tz }).startOf("day");
  const rangeEnd = DateTime.fromISO(endDate, { zone: tz }).endOf("day");

  const busy = await fetchBusyPeriods(
    rangeStart.toUTC().toISO()!,
    rangeEnd.toUTC().toISO()!,
    calendarId,
  );

  const availability: AvailabilityMap = {};

  for (const dateKey of enumerateDateKeys(startDate, endDate)) {
    const slots = generateSlotsForDay(dateKey, tz, busy);
    if (slots.length > 0) {
      availability[dateKey] = slots;
    }
  }

  return availability;
}

export async function isSlotAvailable(
  dateKey: string,
  time: string,
  timezone: string,
  durationMinutes: number = MEETING_DURATION,
): Promise<boolean> {
  const { hours, minutes } = parseTimeString(time);
  const { start, end } = slotToUtcRange(dateKey, hours, minutes, timezone, durationMinutes);

  const rangeStart = DateTime.fromMillis(start).minus({ minutes: 1 }).toUTC().toISO()!;
  const rangeEnd = DateTime.fromMillis(end).plus({ minutes: 1 }).toUTC().toISO()!;

  const busy = await fetchBusyPeriods(rangeStart, rangeEnd, getGoogleCalendarId());
  return !overlapsBusy(start, end, busy);
}

export async function createBooking(
  data: BookingData,
  meetingTitle: string = "30 Minute Meeting",
  durationMinutes: number = MEETING_DURATION,
): Promise<{ eventId: string }> {
  const calendarId = getGoogleCalendarId();
  const calendar = getCalendar();

  const available = await isSlotAvailable(data.date, data.time, data.timezone, durationMinutes);
  if (!available) {
    throw new Error("This time slot is no longer available. Please choose another time.");
  }

  const startIso = toIsoDateTime(data.date, data.time, data.timezone);
  const { hours, minutes } = parseTimeString(data.time);
  const { year, month, day } = parseDateKey(data.date);
  const endDt = DateTime.fromObject(
    { year, month, day, hour: hours, minute: minutes },
    { zone: data.timezone },
  ).plus({ minutes: durationMinutes });
  const endIso = endDt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

  const attendees = [
    { email: data.email, displayName: data.name },
    ...data.guests.map((email) => ({ email })),
  ];

  const response = await calendar.events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: meetingTitle,
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
