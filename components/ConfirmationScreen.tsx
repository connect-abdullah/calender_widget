"use client";

import { DEFAULT_TIMEZONES } from "@/constants/availability";
import { formatBookingDate, formatTimeRange } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import type { BookingData } from "@/types/booking";
import type { MeetingDetails } from "@/types/scheduling";

interface ConfirmationScreenProps {
  meeting: MeetingDetails;
  booking: BookingData;
  onScheduleAnother?: () => void;
}

export function ConfirmationScreen({
  meeting,
  booking,
  onScheduleAnother,
}: ConfirmationScreenProps) {
  const tz = DEFAULT_TIMEZONES.find((t) => t.id === booking.timezone) ?? DEFAULT_TIMEZONES[0];
  const selectedDate = new Date(booking.date + "T12:00:00");
  const timeRange = formatTimeRange(booking.time, meeting.duration);

  return (
    <div
      className="flex flex-col items-center px-6 py-10 text-center md:px-12 md:py-14"
      role="status"
      aria-live="polite"
      aria-label="Booking confirmation"
    >
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-8 w-8 text-green-600"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-neutral-900">Meeting Scheduled</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Your meeting has been successfully booked.
      </p>

      <div className="mt-8 w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-left">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Meeting
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{meeting.title}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Date</p>
          <p className="mt-1 text-sm text-neutral-700">{formatBookingDate(selectedDate)}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Time</p>
          <p className="mt-1 text-sm text-neutral-700">{timeRange}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Timezone
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            {tz.label} ({tz.offset})
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Host</p>
          <p className="mt-1 text-sm text-neutral-700">{meeting.host}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Attendee
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900">{booking.name}</p>
          <p className="text-sm text-neutral-600">{booking.email}</p>
        </div>

        {booking.guests.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Guests
            </p>
            <ul className="mt-1 space-y-0.5">
              {booking.guests.map((guest) => (
                <li key={guest} className="text-sm text-neutral-600">
                  {guest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {onScheduleAnother && (
        <button
          type="button"
          onClick={onScheduleAnother}
          className={cn(
            "mt-8 text-sm font-medium text-blue-600 transition-colors",
            "hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded",
          )}
        >
          Schedule another meeting
        </button>
      )}
    </div>
  );
}
