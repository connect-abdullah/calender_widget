import { create } from "zustand";
import { formatDateKey } from "@/lib/calendar-utils";
import { submitBooking } from "@/lib/booking-service";
import type { BookingData, BookingStep } from "@/types/booking";
import type { BookingFormSchema } from "@/lib/booking-schema";

interface BookingState {
  step: BookingStep;
  selectedDate: Date | null;
  selectedTime: string | null;
  timezone: string;
  formValues: BookingFormSchema;
  confirmedBooking: BookingData | null;
  isSubmitting: boolean;
  error: string | null;

  setStep: (step: BookingStep) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setTimezone: (timezone: string) => void;
  setFormValues: (values: BookingFormSchema) => void;
  goToDetails: () => void;
  goBackToDateTime: () => void;
  submitBookingForm: (values: BookingFormSchema) => Promise<void>;
  reset: () => void;
}

const initialFormValues: BookingFormSchema = {
  name: "",
  email: "",
  guests: [],
  notes: "",
};

export const useBookingStore = create<BookingState>((set, get) => ({
  step: "datetime",
  selectedDate: null,
  selectedTime: null,
  timezone: "Asia/Karachi",
  formValues: initialFormValues,
  confirmedBooking: null,
  isSubmitting: false,
  error: null,

  setStep: (step) => set({ step }),

  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      selectedTime: null,
    }),

  setSelectedTime: (time) => set({ selectedTime: time }),

  setTimezone: (timezone) => set({ timezone }),

  setFormValues: (values) => set({ formValues: values }),

  goToDetails: () => {
    const { selectedDate, selectedTime } = get();
    if (selectedDate && selectedTime) {
      set({ step: "details", error: null });
    }
  },

  goBackToDateTime: () => set({ step: "datetime", error: null }),

  submitBookingForm: async (values) => {
    const { selectedDate, selectedTime, timezone } = get();
    if (!selectedDate || !selectedTime) return;

    set({ isSubmitting: true, error: null, formValues: values });

    const bookingData: BookingData = {
      date: formatDateKey(selectedDate),
      time: selectedTime,
      timezone,
      name: values.name,
      email: values.email,
      guests: values.guests.map((g) => g.email).filter(Boolean),
      notes: values.notes || undefined,
    };

    try {
      await submitBooking(bookingData);
      set({
        confirmedBooking: bookingData,
        step: "confirmation",
        isSubmitting: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        isSubmitting: false,
      });
    }
  },

  reset: () =>
    set({
      step: "datetime",
      selectedDate: null,
      selectedTime: null,
      timezone: "Asia/Karachi",
      formValues: initialFormValues,
      confirmedBooking: null,
      isSubmitting: false,
      error: null,
    }),
}));
