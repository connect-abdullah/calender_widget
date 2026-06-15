import { z } from "zod";

export const hostFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  timezone: z.string().min(1, "Timezone is required"),
  meeting_duration_minutes: z.number().min(15).max(120),
  working_hours_start: z.string().min(1, "Start time is required"),
  working_hours_end: z.string().min(1, "End time is required"),
  available_days: z.array(z.number().min(1).max(7)).min(1, "Select at least one day"),
});

export type HostFormValues = z.infer<typeof hostFormSchema>;

export function toDbTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

export function fromDbTime(time: string): string {
  return time.slice(0, 5);
}

export function encodeOAuthPayload(data: HostFormValues): string {
  const payload = {
    name: data.name,
    timezone: data.timezone,
    meeting_duration_minutes: data.meeting_duration_minutes,
    working_hours_start: toDbTime(data.working_hours_start),
    working_hours_end: toDbTime(data.working_hours_end),
    available_days: data.available_days,
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
