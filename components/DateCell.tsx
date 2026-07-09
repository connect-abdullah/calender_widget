import { cn } from "@/lib/utils";

interface DateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isAvailable: boolean;
  onSelect: (date: Date) => void;
  onKeyDown: (event: React.KeyboardEvent, date: Date) => void;
  tabIndex: number;
}

export function DateCell({
  date,
  isCurrentMonth,
  isSelected,
  isToday,
  isAvailable,
  onSelect,
  onKeyDown,
  tabIndex,
}: DateCellProps) {
  const day = date.getDate();
  const label = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isDisabled = !isCurrentMonth || !isAvailable;

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={label}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      tabIndex={tabIndex}
      onClick={() => !isDisabled && onSelect(date)}
      onKeyDown={(e) => onKeyDown(e, date)}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        !isCurrentMonth && "text-neutral-300",
        isCurrentMonth && !isAvailable && "cursor-not-allowed text-neutral-300",
        isCurrentMonth &&
          isAvailable &&
          !isSelected &&
          "text-neutral-900 hover:bg-blue-50 hover:text-blue-600",
        isSelected && "bg-blue-600 text-white hover:bg-blue-700",
        isToday && !isSelected && isAvailable && "font-semibold text-blue-600",
      )}
    >
      {day}
      {isAvailable && isCurrentMonth && !isSelected && (
        <span
          className="absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-blue-500 sm:bottom-1 sm:h-1 sm:w-1"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
