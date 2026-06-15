import { MeetingScheduler } from "@/components/MeetingScheduler";

const meeting = {
  host: "Muhammad Abdullah",
  title: "30 Minute Meeting",
  duration: 30,
  description: "Web conferencing details provided upon confirmation.",
  meetingType: "video" as const,
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <MeetingScheduler meeting={meeting} />
    </main>
  );
}
