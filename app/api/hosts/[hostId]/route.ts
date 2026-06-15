import { NextRequest, NextResponse } from "next/server";
import { getPublicHostById, updateHost } from "@/lib/hosts";
import type { UpdateHostPayload } from "@/types/host";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hostId: string }> },
) {
  try {
    const { hostId } = await params;
    const host = await getPublicHostById(hostId);

    if (!host) {
      return NextResponse.json({ message: "Host not found" }, { status: 404 });
    }

    return NextResponse.json(host);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch host";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ hostId: string }> },
) {
  try {
    const { hostId } = await params;
    const body = (await request.json()) as UpdateHostPayload;

    if (
      !body.name ||
      !body.timezone ||
      !body.meeting_duration_minutes ||
      !body.working_hours_start ||
      !body.working_hours_end ||
      !body.available_days?.length
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existing = await getPublicHostById(hostId);
    if (!existing) {
      return NextResponse.json({ message: "Host not found" }, { status: 404 });
    }

    const host = await updateHost(hostId, body);
    return NextResponse.json(host);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update host";
    return NextResponse.json({ message }, { status: 500 });
  }
}
