import Link from "next/link";
import { notFound } from "next/navigation";
import { HostForm } from "@/components/admin/HostForm";
import { getPublicHostById } from "@/lib/hosts";

interface EditHostPageProps {
  params: Promise<{ hostId: string }>;
}

export default async function EditHostPage({ params }: EditHostPageProps) {
  const { hostId } = await params;
  const host = await getPublicHostById(hostId);

  if (!host) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Back to hosts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Edit Host</h1>
        <p className="mt-1 text-sm text-neutral-500">Update scheduling settings for {host.name}.</p>
      </div>

      <HostForm mode="edit" hostId={hostId} initialValues={host} />
    </div>
  );
}
