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

export function getOAuthClient() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error(
      "Missing GOOGLE_REFRESH_TOKEN. Visit /connect-google to authorize and add the token to .env.local",
    );
  }

  const oauth2 = getOAuthClientForAuth();
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

export function getCalendar() {
  return google.calendar({ version: "v3", auth: getOAuthClient() });
}

export function getGoogleTimezone(): string {
  return process.env.GOOGLE_TIMEZONE ?? "Asia/Karachi";
}

export function getGoogleCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? "primary";
}
