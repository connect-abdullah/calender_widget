import { NextRequest, NextResponse } from "next/server";
import { fetchHostDaySlots } from "@/lib/availability-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hostId: string }> },
) {
  try {
    const { hostId } = await params;
    const date = request.nextUrl.searchParams.get("date");

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: "Missing or invalid query param: date (YYYY-MM-DD)" },
        { status: 400 },
      );
    }

    const slots = await fetchHostDaySlots(hostId, date);

    return NextResponse.json(slots, {
      headers: {
        "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch day slots";
    const status = message === "Host not found" ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
