export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full overflow-x-hidden bg-neutral-50">{children}</div>;
}
