import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SchedulerApp — Embeddable Meeting Scheduling",
  description:
    "SchedulerApp lets businesses offer embeddable booking widgets that sync with Google Calendar.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-neutral-900">SchedulerApp</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900">
              Privacy
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">SchedulerApp</h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          SchedulerApp is a scheduling widget platform that lets businesses share embeddable
          booking pages. Hosts connect their Google Calendar; guests pick an available time and
          receive a calendar invite automatically.
        </p>

        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900">What SchedulerApp does</h2>
          <ul className="list-inside list-disc space-y-2 text-neutral-600">
            <li>Lets hosts connect Google Calendar via secure OAuth</li>
            <li>Shows real-time availability based on working hours and calendar busy times</li>
            <li>Allows guests to book meetings through an embeddable widget or direct link</li>
            <li>Creates Google Calendar events and sends invites to attendees</li>
          </ul>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Who it is for</h2>
          <p className="text-neutral-600">
            SchedulerApp is built for professionals and small businesses who want a simple,
            Calendly-style booking experience on their own website — without managing complex
            infrastructure.
          </p>
        </section>

        <section className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/admin"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/privacy"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Privacy Policy
          </Link>
        </section>

        <section className="mt-16 border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Contact
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            For support or data requests, contact:{" "}
            <a href="mailto:support@schedulerapp.com" className="text-blue-600 hover:underline">
              support@schedulerapp.com
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-neutral-200 py-6">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} SchedulerApp.{" "}
          <Link href="/privacy" className="hover:text-neutral-700">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
