import { notFound } from "next/navigation";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { fetchHostAvailability } from "@/lib/availability-service";
import { getMonthRange } from "@/lib/queries/availability";
import { getPublicHostById } from "@/lib/hosts";
import type { AvailabilityMap } from "@/types/scheduling";

interface WidgetPageProps {
  params: Promise<{ hostId: string }>;
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { hostId } = await params;
  const host = await getPublicHostById(hostId);

  if (!host) {
    notFound();
  }

  const now = new Date();
  const prefetchMonth = { year: now.getFullYear(), month: now.getMonth() };
  const { start, end } = getMonthRange(prefetchMonth.year, prefetchMonth.month);

  let initialAvailability: AvailabilityMap = {};
  try {
    initialAvailability = await fetchHostAvailability(hostId, start, end);
  } catch {
    // Client will fetch on mount if prefetch fails
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <MeetingScheduler
        hostId={hostId}
        meeting={{
          host: host.name,
          title: `${host.meeting_duration_minutes} Minute Meeting`,
          duration: host.meeting_duration_minutes,
          description: "Web conferencing details provided upon confirmation.",
          meetingType: "video",
        }}
        defaultTimezone={host.timezone}
        initialAvailability={initialAvailability}
        prefetchMonth={prefetchMonth}
      />
    </main>
  );
}
