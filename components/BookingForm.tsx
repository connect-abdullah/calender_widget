"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema } from "@/lib/booking-schema";
import type { BookingFormSchema } from "@/lib/booking-schema";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";

export function BookingForm() {
  const { formValues, isSubmitting, error, submitBookingForm } = useBookingStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  useEffect(() => {
    const firstError = document.querySelector("[aria-invalid='true']");
    if (firstError instanceof HTMLElement) {
      firstError.focus();
    }
  }, [errors]);

  const onSubmit = handleSubmit(async (data) => {
    await submitBookingForm(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 p-6 md:p-8"
      aria-label="Enter booking details"
      noValidate
    >
      <h2 className="text-lg font-semibold text-neutral-900">Enter Details</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm text-neutral-900 transition-colors",
            "placeholder:text-neutral-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            errors.name ? "border-red-400" : "border-neutral-300",
          )}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-red-500" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm text-neutral-900 transition-colors",
            "placeholder:text-neutral-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            errors.email ? "border-red-400" : "border-neutral-300",
          )}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">Add Guests</span>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex-1">
              <label htmlFor={`guest-${index}`} className="sr-only">
                Guest email {index + 1}
              </label>
              <input
                id={`guest-${index}`}
                type="email"
                aria-invalid={!!errors.guests?.[index]?.email}
                aria-describedby={
                  errors.guests?.[index]?.email ? `guest-${index}-error` : undefined
                }
                {...register(`guests.${index}.email`)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 transition-colors",
                  "placeholder:text-neutral-400",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  errors.guests?.[index]?.email ? "border-red-400" : "border-neutral-300",
                )}
                placeholder="guest@email.com"
              />
              {errors.guests?.[index]?.email && (
                <p id={`guest-${index}-error`} className="mt-1 text-xs text-red-500" role="alert">
                  {errors.guests[index]?.email?.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className={cn(
                "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors",
                "hover:bg-neutral-100 hover:text-neutral-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              )}
              aria-label={`Remove guest ${index + 1}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ email: "" })}
          className={cn(
            "flex w-fit items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors",
            "hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Guests
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-neutral-700">
          Please share anything that will help prepare for our meeting.
        </label>
        <textarea
          id="notes"
          rows={4}
          {...register("notes")}
          className={cn(
            "resize-none rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 transition-colors",
            "placeholder:text-neutral-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          )}
          placeholder="Share any details..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={cn(
          "mt-2 w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors",
          "hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Scheduling...
          </span>
        ) : (
          "Schedule Event"
        )}
      </button>
    </form>
  );
}
