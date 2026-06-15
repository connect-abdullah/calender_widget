import { DEFAULT_TIMEZONES } from "@/constants/availability";
import { formatBookingDate, formatTimeRange } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import type { MeetingDetails } from "@/types/scheduling";

interface BookingSummaryCardProps {
  meeting: MeetingDetails;
  selectedDate: Date;
  selectedTime: string;
  timezone: string;
  onBack?: () => void;
  className?: string;
}

export function BookingSummaryCard({
  meeting,
  selectedDate,
  selectedTime,
  timezone,
  onBack,
  className,
}: BookingSummaryCardProps) {
  const tz = DEFAULT_TIMEZONES.find((t) => t.id === timezone) ?? DEFAULT_TIMEZONES[0];
  const timeRange = formatTimeRange(selectedTime, meeting.duration);

  return (
    <aside
      className={cn("flex flex-col gap-5 p-6 md:p-8", className)}
      aria-label="Booking summary"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex w-fit items-center gap-1 text-sm text-neutral-500 transition-colors",
            "hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded",
          )}
          aria-label="Go back to date and time selection"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      )}

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
        <span className="text-sm font-semibold" aria-hidden="true">
          {meeting.host
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      </div>

      <div>
        <p className="text-sm text-neutral-500">{meeting.host}</p>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">{meeting.title}</h1>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span>{meeting.duration} min</span>
      </div>

      <p className="text-sm text-neutral-600">{meeting.description}</p>

      <div className="space-y-3 border-t border-neutral-100 pt-4">
        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="font-medium">{timeRange}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>{formatBookingDate(selectedDate)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12h19.5M12 2.25c2.25 2.25 3.75 5.25 3.75 9s-1.5 6.75-3.75 9c-2.25-2.25-3.75-5.25-3.75-9s1.5-6.75 3.75-9Z"
            />
          </svg>
          <span>
            {tz.label} ({tz.offset})
          </span>
        </div>
      </div>
    </aside>
  );
}
