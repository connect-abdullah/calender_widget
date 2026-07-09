"use client";

import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  date: Date;
  slots: string[];
  selectedTime: string | null;
  isLoading?: boolean;
  onTimeSelect: (time: string) => void;
  showNext?: boolean;
  onNext?: () => void;
}

export function TimeSlots({
  date,
  slots,
  selectedTime,
  isLoading = false,
  onTimeSelect,
  showNext = false,
  onNext,
}: TimeSlotsProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4" aria-label="Available time slots">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">{formattedDate}</h3>
        <p className="mt-0.5 text-xs text-neutral-500">Select a time</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500" role="status" aria-live="polite">
          Loading times…
        </p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-neutral-500" role="status">
          No available times for this date.
        </p>
      ) : (
        <ul className="flex max-h-[180px] flex-col gap-2 overflow-y-auto pr-1 sm:max-h-[240px] md:max-h-[320px]" role="list">
          {slots.map((time) => {
            const isSelected = selectedTime === time;

            return (
              <li key={time}>
                <button
                  type="button"
                  onClick={() => onTimeSelect(time)}
                  aria-pressed={isSelected}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:py-2.5 sm:text-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50",
                  )}
                >
                  {time}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showNext && selectedTime && (
        <button
          type="button"
          onClick={onNext}
          className={cn(
            "mt-2 w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors",
            "hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          )}
        >
          Next
        </button>
      )}
    </div>
  );
}
