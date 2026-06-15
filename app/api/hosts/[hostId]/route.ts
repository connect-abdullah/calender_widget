import { NextRequest, NextResponse } from "next/server";
import { getPublicHostById } from "@/lib/hosts";

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
