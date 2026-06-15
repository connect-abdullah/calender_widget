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
        "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
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
          className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
