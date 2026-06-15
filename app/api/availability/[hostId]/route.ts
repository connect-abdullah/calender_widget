import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "@/lib/google-calendar";
import { getHostById, hostToScheduleConfig } from "@/lib/hosts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hostId: string }> },
) {
  try {
    const { hostId } = await params;
    const { searchParams } = request.nextUrl;
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { message: "Missing required query params: start, end" },
        { status: 400 },
      );
    }

    const host = await getHostById(hostId);
    if (!host) {
      return NextResponse.json({ message: "Host not found" }, { status: 404 });
    }

    const config = hostToScheduleConfig(host);
    const availability = await getAvailability(config, start, end);
    return NextResponse.json(availability);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch availability";
    return NextResponse.json({ message }, { status: 500 });
  }
}
