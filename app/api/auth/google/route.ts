import { NextResponse } from "next/server";
import { getOAuthClientForAuth } from "@/lib/google-client";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export async function GET() {
  const oauth2 = getOAuthClientForAuth();

  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  return NextResponse.redirect(authUrl);
}
