"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookingForm } from "@/components/BookingForm";
import { BookingSummaryCard } from "@/components/BookingSummaryCard";
import { CalendarGrid } from "@/components/CalendarGrid";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { MeetingInfoCard } from "@/components/MeetingInfoCard";
import { TimeSlots } from "@/components/TimeSlots";
import { DEFAULT_TIMEZONES } from "@/constants/availability";
import { formatDateKey } from "@/lib/calendar-utils";
import {
  getDaySlotsWithFallback,
  getMonthAvailabilityWithFallback,
  useDaySlots,
  useHostMonthAvailability,
} from "@/lib/hooks/use-host-availability";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import type { MeetingSchedulerProps } from "@/types/scheduling";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const confirmationVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export function MeetingScheduler({
  hostId,
  meeting,
  initialMonthAvailability,
  prefetchMonth,
  defaultTimezone = "Asia/Karachi",
  onDateSelect,
  onTimeSelect,
}: MeetingSchedulerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const {
    data: monthAvailabilityData,
    isLoading: isLoadingMonth,
    isFetching: isFetchingMonth,
    isError: isMonthError,
    error: monthQueryError,
  } = useHostMonthAvailability({
    hostId,
    year,
    month,
    initialMonthAvailability,
    prefetchMonth,
  });

  const { monthAvailability, usedFallback: usedMonthFallback } =
    getMonthAvailabilityWithFallback(monthAvailabilityData, isMonthError);

  const monthError =
    isMonthError && monthQueryError
      ? monthQueryError.message
      : usedMonthFallback
        ? "Could not load live availability"
        : null;

  const {
    step,
    selectedDate,
    selectedTime,
    timezone,
    confirmedBooking,
    setSelectedDate,
    setSelectedTime,
    setTimezone,
    setHostId,
    goToDetails,
    goBackToDateTime,
    reset,
  } = useBookingStore();

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  const {
    data: daySlotsData,
    isLoading: isLoadingDaySlots,
    isError: isDaySlotsError,
  } = useDaySlots(hostId, selectedDateKey);

  const { slots: daySlots } = getDaySlotsWithFallback(
    daySlotsData,
    isDaySlotsError,
    selectedDateKey,
  );

  useEffect(() => {
    if (hostId) {
      setHostId(hostId);
    }
  }, [hostId, setHostId]);

  useEffect(() => {
    setTimezone(defaultTimezone);
  }, [defaultTimezone, setTimezone]);

  useEffect(() => {
    if (step === "confirmation" && containerRef.current) {
      containerRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDateKey, setSelectedTime]);

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    },
    [setSelectedDate, onDateSelect],
  );

  const handleTimeSelect = useCallback(
    (time: string) => {
      setSelectedTime(time);
      if (selectedDate) {
        onTimeSelect?.(selectedDate, time);
      }
    },
    [selectedDate, setSelectedTime, onTimeSelect],
  );

  const handleNext = useCallback(() => {
    setDirection(1);
    goToDetails();
  }, [goToDetails]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    goBackToDateTime();
  }, [goBackToDateTime]);

  const handleScheduleAnother = useCallback(() => {
    reset();
    setCurrentMonth(new Date());
    setDirection(0);
  }, [reset]);

  const showTimePanel = selectedDate !== null;
  const canProceed = selectedDate !== null && selectedTime !== null;

  const cardClassName = cn(
    "mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg",
  );

  if (step === "confirmation" && confirmedBooking) {
    return (
      <div
        ref={containerRef}
        className={cardClassName}
        tabIndex={-1}
        aria-label="Booking confirmation"
      >
        <motion.div
          key="confirmation"
          variants={confirmationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ConfirmationScreen
            meeting={meeting}
            booking={confirmedBooking}
            onScheduleAnother={handleScheduleAnother}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cardClassName} tabIndex={-1}>
      <AnimatePresence mode="wait" custom={direction}>
        {step === "datetime" ? (
          <motion.div
            key="datetime"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col md:flex-row"
          >
            <div className="border-b border-neutral-200 md:w-[280px] md:shrink-0 md:border-b-0 md:border-r">
              <MeetingInfoCard meeting={meeting} />
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
              <div
                className={cn(
                  "flex flex-1 flex-col p-6 md:p-8",
                  showTimePanel ? "md:border-r md:border-neutral-200" : "",
                )}
              >
                <CalendarGrid
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  monthAvailability={monthAvailability}
                  onMonthChange={setCurrentMonth}
                  onDateSelect={handleDateSelect}
                />

                {isFetchingMonth && !isLoadingMonth && (
                  <p className="mt-2 text-xs text-neutral-400" role="status" aria-live="polite">
                    Updating…
                  </p>
                )}
                {isLoadingMonth && (
                  <p className="mt-2 text-xs text-neutral-500" role="status" aria-live="polite">
                    Loading availability…
                  </p>
                )}
                {monthError && (
                  <p className="mt-2 text-xs text-amber-600" role="alert">
                    {monthError} — showing sample data.
                  </p>
                )}

                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <label htmlFor="timezone-select" className="sr-only">
                    Time zone
                  </label>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4 shrink-0 text-neutral-500"
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
                    <select
                      id="timezone-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className={cn(
                        "w-full cursor-pointer appearance-none rounded bg-transparent text-sm text-neutral-700",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      )}
                      aria-label="Select time zone"
                    >
                      {DEFAULT_TIMEZONES.map((tz) => (
                        <option key={tz.id} value={tz.id}>
                          {tz.label} ({tz.offset})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showTimePanel && selectedDate && (
                  <motion.div
                    key="time-panel"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full border-t border-neutral-200 p-6 md:w-[220px] md:shrink-0 md:border-t-0 md:p-8"
                    role="region"
                    aria-label="Available times"
                  >
                    <TimeSlots
                      date={selectedDate}
                      slots={daySlots}
                      selectedTime={selectedTime}
                      isLoading={isLoadingDaySlots}
                      onTimeSelect={handleTimeSelect}
                      showNext={canProceed}
                      onNext={handleNext}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col md:flex-row"
          >
            <div className="border-b border-neutral-200 md:w-[280px] md:shrink-0 md:border-b-0 md:border-r">
              {selectedDate && selectedTime && (
                <BookingSummaryCard
                  meeting={meeting}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  timezone={timezone}
                  onBack={handleBack}
                />
              )}
            </div>

            <div className="flex-1">
              <BookingForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
