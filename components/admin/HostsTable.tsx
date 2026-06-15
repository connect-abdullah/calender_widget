"use client";

import { useState } from "react";
import type { PublicHost } from "@/types/host";

interface HostsTableProps {
  hosts: PublicHost[];
  origin: string;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function HostsTable({ hosts, origin }: HostsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmbed = async (hostId: string) => {
    const code = `<iframe src="${origin}/widget/${hostId}" width="100%" height="700" frameborder="0"></iframe>`;
    await navigator.clipboard.writeText(code);
    setCopiedId(hostId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (hosts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
        No hosts yet. Add your first host to generate a booking widget.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Timezone</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Duration</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Hours</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host) => (
            <tr key={host.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3 font-medium text-neutral-900">{host.name}</td>
              <td className="px-4 py-3 text-neutral-600">{host.timezone}</td>
              <td className="px-4 py-3 text-neutral-600">{host.meeting_duration_minutes} min</td>
              <td className="px-4 py-3 text-neutral-600">
                {formatTime(host.working_hours_start)} – {formatTime(host.working_hours_end)}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/widget/${host.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Open Widget
                  </a>
                  <button
                    type="button"
                    onClick={() => copyEmbed(host.id)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    {copiedId === host.id ? "Copied!" : "Copy Embed"}
                  </button>
                  <a
                    href={`/api/auth/google/start?hostId=${host.id}`}
                    className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Reconnect
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
