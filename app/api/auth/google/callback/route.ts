import { NextRequest, NextResponse } from "next/server";
import { getOAuthClientForAuth } from "@/lib/google-client";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(`Authorization failed: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse("Missing authorization code", { status: 400 });
  }

  const oauth2 = getOAuthClientForAuth();
  const { tokens } = await oauth2.getToken(code);

  if (tokens.refresh_token) {
    console.log("GOOGLE_REFRESH_TOKEN:", tokens.refresh_token);
  } else {
    console.log("No refresh token returned. Revoke app access and try again with prompt=consent.");
  }

  const refreshToken = tokens.refresh_token ?? "No refresh token received — revoke access and retry.";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Google Calendar Connected</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 48px auto; padding: 0 24px; color: #171717; }
    h1 { font-size: 1.5rem; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; word-break: break-all; font-size: 13px; }
    ol { line-height: 1.8; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Google Calendar Connected</h1>
  <p>Copy this refresh token into your <code>.env.local</code> file:</p>
  <pre id="token">${refreshToken}</pre>
  <button onclick="navigator.clipboard.writeText(document.getElementById('token').textContent)">Copy token</button>
  <ol>
    <li>Add <code>GOOGLE_REFRESH_TOKEN=&lt;token&gt;</code> to <code>.env.local</code></li>
    <li>Restart the dev server</li>
    <li>Go to <a href="/">the booking page</a></li>
  </ol>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
