import "server-only";
import { google } from "googleapis";

function getCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI");
  }

  return { clientId, clientSecret, redirectUri };
}

export function getOAuthClientForAuth() {
  const { clientId, clientSecret, redirectUri } = getCredentials();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getOAuthClientForHost(refreshToken: string) {
  const oauth2 = getOAuthClientForAuth();
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

const calendarCache = new Map<string, ReturnType<typeof google.calendar>>();

export function getCalendarForHost(refreshToken: string) {
  let calendar = calendarCache.get(refreshToken);
  if (!calendar) {
    calendar = google.calendar({ version: "v3", auth: getOAuthClientForHost(refreshToken) });
    calendarCache.set(refreshToken, calendar);
  }
  return calendar;
}
