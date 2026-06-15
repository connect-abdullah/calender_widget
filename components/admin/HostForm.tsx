"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { DEFAULT_TIMEZONES } from "@/constants/availability";
import { DEFAULT_AVAILABLE_DAYS, WEEKDAYS } from "@/lib/host-days";
import {
  encodeOAuthPayload,
  fromDbTime,
  hostFormSchema,
  toDbTime,
  type HostFormValues,
} from "@/lib/host-form-schema";
import { cn } from "@/lib/utils";
import type { PublicHost } from "@/types/host";

interface HostFormProps {
  mode: "create" | "edit";
  hostId?: string;
  initialValues?: PublicHost;
}

export function HostForm({ mode, hostId, initialValues }: HostFormProps) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<HostFormValues>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      timezone: initialValues?.timezone ?? "Asia/Karachi",
      meeting_duration_minutes: initialValues?.meeting_duration_minutes ?? 30,
      working_hours_start: initialValues
        ? fromDbTime(initialValues.working_hours_start)
        : "09:00",
      working_hours_end: initialValues ? fromDbTime(initialValues.working_hours_end) : "17:00",
      available_days: initialValues?.available_days ?? DEFAULT_AVAILABLE_DAYS,
    },
  });

  const selectedDays = useWatch({ control, name: "available_days" }) ?? [];

  const toggleDay = (day: number) => {
    const current = selectedDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => a - b);
    setValue("available_days", next, { shouldValidate: true });
  };

  const onConnect = handleSubmit((data) => {
    const payload = encodeOAuthPayload(data);
    window.location.href = `/api/auth/google/start?payload=${payload}`;
  });

  const onSave = handleSubmit(async (data) => {
    if (!hostId) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/hosts/${hostId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          timezone: data.timezone,
          meeting_duration_minutes: data.meeting_duration_minutes,
          working_hours_start: toDbTime(data.working_hours_start),
          working_hours_end: toDbTime(data.working_hours_end),
          available_days: data.available_days,
        }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? "Failed to save");
      }

      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <form
      onSubmit={mode === "create" ? onConnect : onSave}
      className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className={cn(
            "mt-1 w-full rounded-lg border px-3 py-2 text-sm",
            errors.name ? "border-red-400" : "border-neutral-300",
          )}
          placeholder="Muhammad Abdullah"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="timezone" className="text-sm font-medium text-neutral-700">
          Timezone
        </label>
        <select
          id="timezone"
          {...register("timezone")}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {DEFAULT_TIMEZONES.map((tz) => (
            <option key={tz.id} value={tz.id}>
              {tz.label} ({tz.offset})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="duration" className="text-sm font-medium text-neutral-700">
          Meeting duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          {...register("meeting_duration_minutes", { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="text-sm font-medium text-neutral-700">
            Working hours start
          </label>
          <input
            id="start"
            type="time"
            {...register("working_hours_start")}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="end" className="text-sm font-medium text-neutral-700">
            Working hours end
          </label>
          <input
            id="end"
            type="time"
            {...register("working_hours_end")}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-700">Available days</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => {
            const isSelected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-300 text-neutral-600 hover:bg-neutral-50",
                )}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {errors.available_days && (
          <p className="mt-1 text-xs text-red-500">{errors.available_days.message}</p>
        )}
      </fieldset>

      {saveError && (
        <p className="text-sm text-red-500" role="alert">
          {saveError}
        </p>
      )}
      {saveSuccess && (
        <p className="text-sm text-green-600" role="status">
          Changes saved successfully.
        </p>
      )}

      {mode === "create" ? (
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Connect Google Calendar
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {hostId && (
            <Link
              href={`/api/auth/google/start?hostId=${hostId}`}
              className="flex-1 rounded-full border border-blue-200 px-6 py-3 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Reconnect Calendar
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
