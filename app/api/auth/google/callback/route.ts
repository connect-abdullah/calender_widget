import { NextRequest, NextResponse } from "next/server";
import { createHost, updateHostTokens } from "@/lib/hosts";
import { getOAuthClientForAuth } from "@/lib/google-client";
import type { NewHostPayload } from "@/types/host";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.json({ message: "Missing code or state" }, { status: 400 });
  }

  try {
    const oauth2 = getOAuthClientForAuth();
    const { tokens } = await oauth2.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL(
          "/admin?error=" +
            encodeURIComponent("No refresh token received. Revoke app access and try again."),
          request.url,
        ),
      );
    }

    const calendarId = "primary";

    if (state.startsWith("reconnect:")) {
      const hostId = state.replace("reconnect:", "");
      await updateHostTokens(hostId, tokens.refresh_token, calendarId);
      return NextResponse.redirect(new URL(`/admin?reconnected=${hostId}`, request.url));
    }

    if (state.startsWith("new:")) {
      const payloadB64 = state.replace("new:", "");
      const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
      const payload = JSON.parse(payloadJson) as NewHostPayload;

      const host = await createHost(payload, tokens.refresh_token, calendarId);
      return NextResponse.redirect(new URL(`/admin?created=${host.id}`, request.url));
    }

    return NextResponse.json({ message: "Invalid state parameter" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth callback failed";
    return NextResponse.redirect(new URL(`/admin?error=${encodeURIComponent(message)}`, request.url));
  }
}
