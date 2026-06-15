import Link from "next/link";
import { HostForm } from "@/components/admin/HostForm";

export default function NewHostPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Back to hosts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Add Host</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Fill in the details, then connect Google Calendar to complete setup.
        </p>
      </div>

      <HostForm mode="create" />
    </div>
  );
}
