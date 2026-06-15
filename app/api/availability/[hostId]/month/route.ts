import { NextRequest, NextResponse } from "next/server";
import { fetchHostMonthAvailability } from "@/lib/availability-service";

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

    const availability = await fetchHostMonthAvailability(hostId, start, end);

    return NextResponse.json(availability, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch availability";
    const status = message === "Host not found" ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
