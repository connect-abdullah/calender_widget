import Link from "next/link";

export default function ConnectGooglePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">Connect Google Calendar</h1>
        <p className="mt-2 text-sm text-neutral-600">
          One-time setup. Authorize access to your Google Calendar, then copy the refresh token
          into <code className="rounded bg-neutral-100 px-1">.env.local</code>.
        </p>
      </div>

      <Link
        href="/api/auth/google"
        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Connect Google Calendar
      </Link>
    </main>
  );
}
