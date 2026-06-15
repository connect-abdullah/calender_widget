import { NextResponse } from "next/server";
import { listHosts } from "@/lib/hosts";

export async function GET() {
  try {
    const hosts = await listHosts();
    return NextResponse.json(hosts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list hosts";
    return NextResponse.json({ message }, { status: 500 });
  }
}
