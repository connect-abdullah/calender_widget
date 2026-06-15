import type { BookingData } from "@/types/booking";

export async function submitBooking(
  hostId: string,
  data: BookingData,
): Promise<{ eventId: string }> {
  const res = await fetch(`/api/book/${hostId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Booking failed");
  }

  return res.json() as Promise<{ eventId: string }>;
}
