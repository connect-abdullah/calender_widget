import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — SchedulerApp",
  description: "Privacy Policy for SchedulerApp scheduling widget platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-neutral-900">
            SchedulerApp
          </Link>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-neutral">
        <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Overview</h2>
          <p>
            SchedulerApp (&quot;we&quot;, &quot;our&quot;) provides an embeddable meeting scheduling
            widget. This policy explains what information we collect, how we use it, and your
            rights regarding your data.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Information we collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Host information:</strong> name, timezone, working hours, and encrypted
              Google Calendar OAuth tokens stored when a host connects their calendar.
            </li>
            <li>
              <strong>Guest booking information:</strong> name, email address, optional guest
              emails, and optional meeting notes submitted when booking a meeting.
            </li>
            <li>
              <strong>Calendar data:</strong> via the Google Calendar API, we read free/busy
              availability to display open time slots and create calendar events when bookings
              are made.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">How we use Google Calendar data</h2>
          <p>
            SchedulerApp uses Google Calendar API scopes to read calendar availability (free/busy
            times) and to create calendar events when a guest books a meeting. We do not use
            Google Calendar data for advertising, and we do not sell calendar data to third
            parties.
          </p>
          <p>
            Google Calendar access is limited to what is necessary to provide the scheduling
            service. Hosts can revoke access at any time through their{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account permissions
            </a>
            .
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Data storage and security</h2>
          <p>
            Host configuration and encrypted OAuth tokens are stored in Supabase. Google refresh
            tokens are encrypted at rest using AES-256-GCM before being saved. We do not expose
            refresh tokens to the browser or to end users.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Data sharing</h2>
          <p>
            We do not sell personal information. Booking details are shared with the host&apos;s
            Google Calendar as calendar event attendees. We use Supabase for database hosting and
            Google APIs for calendar functionality.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data by
            contacting us at{" "}
            <a href="mailto:support@schedulerapp.com" className="text-blue-600 hover:underline">
              support@schedulerapp.com
            </a>
            . Hosts can disconnect Google Calendar and request account deletion at any time.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900">Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href="mailto:support@schedulerapp.com" className="text-blue-600 hover:underline">
              support@schedulerapp.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
