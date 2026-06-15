import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/google-calendar";
import type { BookingData } from "@/types/booking";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingData;

    if (!body.date || !body.time || !body.timezone || !body.name || !body.email) {
      return NextResponse.json({ message: "Missing required booking fields" }, { status: 400 });
    }

    const result = await createBooking(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create booking";
    const status = message.includes("no longer available") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
