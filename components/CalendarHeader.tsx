import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentMonth: Date;
  disablePreviousMonth?: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({
  currentMonth,
  disablePreviousMonth = false,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      <h2
        id="calendar-month-label"
        className="text-base font-semibold text-neutral-900"
        aria-live="polite"
      >
        {monthLabel}
      </h2>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPreviousMonth}
          disabled={disablePreviousMonth}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "text-neutral-600 transition-colors",
            "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            disablePreviousMonth && "cursor-not-allowed opacity-40 hover:bg-transparent",
          )}
          aria-label="Previous month"
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
        </button>

        <button
          type="button"
          onClick={onNextMonth}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "text-neutral-600 transition-colors",
            "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          )}
          aria-label="Next month"
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
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
