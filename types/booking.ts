export type BookingStep = "datetime" | "details" | "confirmation";

export interface BookingData {
  date: string;
  time: string;
  timezone: string;
  name: string;
  email: string;
  guests: string[];
  notes?: string;
  meetLink?: string;
}

export type { BookingFormSchema as BookingFormValues } from "@/lib/booking-schema";
