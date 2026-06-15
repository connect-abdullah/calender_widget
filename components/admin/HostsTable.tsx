"use client";

import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { formatAvailableDays } from "@/lib/host-days";
import { cn } from "@/lib/utils";
import type { PublicHost } from "@/types/host";

interface HostsTableProps {
  hosts: PublicHost[];
  origin: string;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function IconButton({
  href,
  onClick,
  label,
  children,
  variant = "default",
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
  variant?: "default" | "primary";
}) {
  const className = cn(
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    variant === "primary"
      ? "border-blue-200 text-blue-600 hover:bg-blue-50"
      : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") || href.startsWith("/widget") ? "_blank" : undefined}
        rel={href.startsWith("http") || href.startsWith("/widget") ? "noopener noreferrer" : undefined}
        className={className}
        title={label}
        aria-label={label}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} title={label} aria-label={label}>
      {children}
    </button>
  );
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/80">
              <th className="px-5 py-3.5 font-medium text-neutral-500">Host</th>
              <th className="px-5 py-3.5 font-medium text-neutral-500">Schedule</th>
              <th className="px-5 py-3.5 font-medium text-neutral-500">Availability</th>
              <th className="px-5 py-3.5 text-right font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {hosts.map((host) => {
              const isCopied = copiedId === host.id;

              return (
                <tr key={host.id} className="group transition-colors hover:bg-neutral-50/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                        {host.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{host.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-neutral-400">{host.id.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1.5 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />
                        <span>{host.timezone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />
                        <span>
                          {host.meeting_duration_minutes} min · {formatTime(host.working_hours_start)}–
                          {formatTime(host.working_hours_end)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-neutral-600">
                    {formatAvailableDays(host.available_days ?? [1, 2, 3, 4, 5])}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <IconButton href={`/admin/hosts/${host.id}/edit`} label="Edit host">
                        <Pencil className="h-4 w-4" aria-hidden />
                      </IconButton>

                      <IconButton href={`/widget/${host.id}`} label="Open widget">
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </IconButton>

                      <IconButton
                        onClick={() => copyEmbed(host.id)}
                        label={isCopied ? "Embed code copied" : "Copy embed code"}
                        variant={isCopied ? "primary" : "default"}
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden />
                        )}
                      </IconButton>

                      <IconButton
                        href={`/api/auth/google/start?hostId=${host.id}`}
                        label="Reconnect Google Calendar"
                        variant="primary"
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
