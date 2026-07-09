import { notFound } from "next/navigation";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { getPublicHostById } from "@/lib/hosts";

interface WidgetPageProps {
  params: Promise<{ hostId: string }>;
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { hostId } = await params;
  const host = await getPublicHostById(hostId);

  if (!host) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full min-w-0 max-w-full items-center justify-center overflow-x-hidden px-3 py-4 sm:p-4 md:p-8">
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
      />
    </main>
  );
}
