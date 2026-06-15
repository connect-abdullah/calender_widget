import "server-only";
import { decrypt, encrypt } from "@/lib/encryption";
import { createServerClient } from "@/lib/supabase/server";
import { DEFAULT_AVAILABLE_DAYS } from "@/lib/host-days";
import type {
  Host,
  HostScheduleConfig,
  NewHostPayload,
  PublicHost,
  UpdateHostPayload,
} from "@/types/host";

const PUBLIC_HOST_COLUMNS =
  "id, name, timezone, meeting_duration_minutes, working_hours_start, working_hours_end, available_days, google_calendar_id, created_at";

function toPublicHost(host: Host): PublicHost {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { google_refresh_token, ...publicHost } = host;
  return publicHost;
}

export function hostToScheduleConfig(host: Host): HostScheduleConfig {
  return {
    timezone: host.timezone,
    meetingDurationMinutes: host.meeting_duration_minutes,
    workingHoursStart: host.working_hours_start,
    workingHoursEnd: host.working_hours_end,
    availableDays: host.available_days ?? DEFAULT_AVAILABLE_DAYS,
    calendarId: host.google_calendar_id || "primary",
    refreshToken: decrypt(host.google_refresh_token),
    meetingTitle: `${host.meeting_duration_minutes} Minute Meeting`,
  };
}

export async function listHosts(): Promise<PublicHost[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hosts")
    .select(PUBLIC_HOST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PublicHost[];
}

export async function getHostById(hostId: string): Promise<Host | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("hosts").select("*").eq("id", hostId).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data as Host;
}

export async function getPublicHostById(hostId: string): Promise<PublicHost | null> {
  const host = await getHostById(hostId);
  return host ? toPublicHost(host) : null;
}

export async function createHost(
  payload: NewHostPayload,
  refreshToken: string,
  calendarId: string = "primary",
): Promise<PublicHost> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hosts")
    .insert({
      name: payload.name,
      timezone: payload.timezone,
      meeting_duration_minutes: payload.meeting_duration_minutes,
      working_hours_start: payload.working_hours_start,
      working_hours_end: payload.working_hours_end,
      available_days: payload.available_days,
      google_refresh_token: encrypt(refreshToken),
      google_calendar_id: calendarId,
    })
    .select(PUBLIC_HOST_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as PublicHost;
}

export async function updateHost(hostId: string, payload: UpdateHostPayload): Promise<PublicHost> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hosts")
    .update({
      name: payload.name,
      timezone: payload.timezone,
      meeting_duration_minutes: payload.meeting_duration_minutes,
      working_hours_start: payload.working_hours_start,
      working_hours_end: payload.working_hours_end,
      available_days: payload.available_days,
    })
    .eq("id", hostId)
    .select(PUBLIC_HOST_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as PublicHost;
}

export async function updateHostTokens(
  hostId: string,
  refreshToken: string,
  calendarId: string = "primary",
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("hosts")
    .update({
      google_refresh_token: encrypt(refreshToken),
      google_calendar_id: calendarId,
    })
    .eq("id", hostId);

  if (error) throw new Error(error.message);
}
