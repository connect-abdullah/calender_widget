"use client";

import { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const tz = DEFAULT_TIMEZONES.find((t) => t.id === booking.timezone) ?? DEFAULT_TIMEZONES[0];
  const selectedDate = new Date(booking.date + "T12:00:00");
  const timeRange = formatTimeRange(booking.time, meeting.duration);

  const handleCopyMeetLink = async () => {
    if (!booking.meetLink) return;
    await navigator.clipboard.writeText(booking.meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col items-center px-4 py-8 text-center sm:px-6 md:py-10"
      role="status"
      aria-live="polite"
      aria-label="Booking confirmation"
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6 text-green-600"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-neutral-900">Meeting Scheduled</h2>
      <p className="mt-1 text-sm text-neutral-500">Your meeting has been successfully booked.</p>

      <div className="mt-6 w-full space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left md:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Meeting</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{meeting.title}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Date &amp; Time
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            {formatBookingDate(selectedDate)} · {timeRange}
          </p>
          <p className="text-sm text-neutral-500">
            {tz.label} ({tz.offset})
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Host</p>
          <p className="mt-1 text-sm text-neutral-700">{meeting.host}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Attendee</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">{booking.name}</p>
          <p className="text-sm text-neutral-600">{booking.email}</p>
          {booking.guests.length > 0 && (
            <p className="mt-1 text-sm text-neutral-500">Guests: {booking.guests.join(", ")}</p>
          )}
        </div>

        {booking.meetLink ? (
          <div className="border-t border-neutral-200 pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Google Meet
            </p>
            <a
              href={booking.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Join Google Meet
            </a>
            <p className="mt-1 break-all text-xs text-neutral-500">{booking.meetLink}</p>
            <button
              type="button"
              onClick={handleCopyMeetLink}
              className={cn(
                "mt-2 text-xs font-medium text-blue-600 transition-colors",
                "hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded",
              )}
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <p className="mt-2 text-xs text-neutral-500">
              An invite with this link has been sent to your email.
            </p>
          </div>
        ) : (
          <p className="border-t border-neutral-200 pt-3 text-xs text-neutral-500">
            Check your email for the meeting invite.
          </p>
        )}
      </div>

      {onScheduleAnother && (
        <button
          type="button"
          onClick={onScheduleAnother}
          className={cn(
            "mt-6 text-sm font-medium text-blue-600 transition-colors",
            "hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded",
          )}
        >
          Schedule another meeting
        </button>
      )}
    </div>
  );
}
