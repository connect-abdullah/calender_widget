"use client";

import { useCallback, useMemo } from "react";
import { CalendarHeader } from "@/components/CalendarHeader";
import { DateCell } from "@/components/DateCell";
import {
  formatDateKey,
  getCalendarDays,
  isSameDay,
  WEEKDAY_LABELS,
} from "@/lib/calendar-utils";
import type { MonthAvailabilityMap } from "@/types/scheduling";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date | null;
  monthAvailability: MonthAvailabilityMap;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({
  currentMonth,
  selectedDate,
  monthAvailability,
  onMonthChange,
  onDateSelect,
}: CalendarGridProps) {
  const today = useMemo(() => new Date(), []);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const handlePreviousMonth = useCallback(() => {
    onMonthChange(new Date(year, month - 1, 1));
  }, [year, month, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    onMonthChange(new Date(year, month + 1, 1));
  }, [year, month, onMonthChange]);

  const isDateAvailable = useCallback(
    (dateKey: string) => monthAvailability[dateKey] === true,
    [monthAvailability],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, date: Date) => {
      const dateKey = formatDateKey(date);
      if (!isDateAvailable(dateKey)) return;

      let newDate: Date | null = null;

      switch (event.key) {
        case "ArrowLeft":
          newDate = new Date(date);
          newDate.setDate(date.getDate() - 1);
          break;
        case "ArrowRight":
          newDate = new Date(date);
          newDate.setDate(date.getDate() + 1);
          break;
        case "ArrowUp":
          newDate = new Date(date);
          newDate.setDate(date.getDate() - 7);
          break;
        case "ArrowDown":
          newDate = new Date(date);
          newDate.setDate(date.getDate() + 7);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onDateSelect(date);
          return;
        default:
          return;
      }

      if (newDate) {
        event.preventDefault();
        if (newDate.getMonth() !== month || newDate.getFullYear() !== year) {
          onMonthChange(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
        }
        if (isDateAvailable(formatDateKey(newDate))) {
          onDateSelect(newDate);
        }
      }
    },
    [isDateAvailable, month, year, onDateSelect, onMonthChange],
  );

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <div
        role="grid"
        aria-labelledby="calendar-month-label"
        className="grid grid-cols-7 gap-y-1"
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            role="columnheader"
            className="flex h-8 items-center justify-center text-xs font-medium text-neutral-500"
          >
            {label}
          </div>
        ))}

        {days.map((date) => {
          const isCurrentMonth = date.getMonth() === month;
          const dateKey = formatDateKey(date);
          const isAvailable = isDateAvailable(dateKey);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);

          return (
            <div key={dateKey + date.getMonth()} className="flex items-center justify-center">
              <DateCell
                date={date}
                isCurrentMonth={isCurrentMonth}
                isSelected={isSelected}
                isToday={isToday}
                isAvailable={isAvailable}
                onSelect={onDateSelect}
                onKeyDown={handleKeyDown}
                tabIndex={isSelected ? 0 : -1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
