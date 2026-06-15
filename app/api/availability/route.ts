import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const tz = searchParams.get("tz") ?? undefined;

    if (!start || !end) {
      return NextResponse.json(
        { message: "Missing required query params: start, end" },
        { status: 400 },
      );
    }

    const availability = await getAvailability(start, end, tz);
    return NextResponse.json(availability);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch availability";
    return NextResponse.json({ message }, { status: 500 });
  }
}
