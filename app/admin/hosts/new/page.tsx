"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { DEFAULT_TIMEZONES } from "@/constants/availability";
import { cn } from "@/lib/utils";

const hostFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  timezone: z.string().min(1, "Timezone is required"),
  meeting_duration_minutes: z.number().min(15).max(120),
  working_hours_start: z.string().min(1, "Start time is required"),
  working_hours_end: z.string().min(1, "End time is required"),
});

type HostFormValues = z.infer<typeof hostFormSchema>;

function toDbTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function encodePayload(data: HostFormValues): string {
  const payload = {
    name: data.name,
    timezone: data.timezone,
    meeting_duration_minutes: data.meeting_duration_minutes,
    working_hours_start: toDbTime(data.working_hours_start),
    working_hours_end: toDbTime(data.working_hours_end),
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function NewHostPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HostFormValues>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      name: "",
      timezone: "Asia/Karachi",
      meeting_duration_minutes: 30,
      working_hours_start: "09:00",
      working_hours_end: "17:00",
    },
  });

  const onConnect = handleSubmit((data) => {
    const payload = encodePayload(data);
    window.location.href = `/api/auth/google/start?payload=${payload}`;
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Back to hosts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Add Host</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Fill in the details, then connect Google Calendar to complete setup.
        </p>
      </div>

      <form onSubmit={onConnect} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
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

        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Connect Google Calendar
        </button>
      </form>
    </div>
  );
}
