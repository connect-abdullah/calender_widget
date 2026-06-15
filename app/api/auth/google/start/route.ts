import { NextRequest, NextResponse } from "next/server";
import { getOAuthClientForAuth } from "@/lib/google-client";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export async function GET(request: NextRequest) {
  const hostId = request.nextUrl.searchParams.get("hostId");
  const payload = request.nextUrl.searchParams.get("payload");

  if (!hostId && !payload) {
    return NextResponse.json(
      { message: "Missing hostId or payload query parameter" },
      { status: 400 },
    );
  }

  const state = hostId ? `reconnect:${hostId}` : `new:${payload}`;

  const oauth2 = getOAuthClientForAuth();
  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });

  return NextResponse.redirect(authUrl);
}
