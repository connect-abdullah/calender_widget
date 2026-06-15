import { headers } from "next/headers";
import { HostsTable } from "@/components/admin/HostsTable";
import { listHosts } from "@/lib/hosts";

interface AdminPageProps {
  searchParams: Promise<{ created?: string; reconnected?: string; error?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const hosts = await listHosts();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${protocol}://${host}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Hosts</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage scheduling widgets for each host.
        </p>
      </div>

      {params.created && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Host created successfully. Widget URL:{" "}
          <a href={`/widget/${params.created}`} className="font-medium underline">
            /widget/{params.created}
          </a>
        </p>
      )}

      {params.reconnected && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Google Calendar reconnected for host {params.reconnected}.
        </p>
      )}

      {params.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {decodeURIComponent(params.error)}
        </p>
      )}

      <HostsTable hosts={hosts} origin={origin} />
    </div>
  );
}
