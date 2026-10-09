"use client";

import { AppShell, PageFrame } from "@/components/app-shell";
import { LiveMap } from "@/components/live-map";

export default function MapPage() {
  return (
    <AppShell>
      <PageFrame eyebrow="Explore" title="Live map" description="See rain radar, risk zones, and route conditions around you.">
        <div className="flex flex-col gap-4"><LiveMap /><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-[#0b202c] p-4"><p className="text-xs text-slate-500">Map source</p><p className="mt-1 text-sm font-semibold">Google Maps live tiles</p></div><div className="rounded-xl border border-white/10 bg-[#0b202c] p-4"><p className="text-xs text-slate-500">Route conditions</p><p className="mt-1 text-sm font-semibold text-[#42db8b]">Updated with map data</p></div><div className="rounded-xl border border-white/10 bg-[#0b202c] p-4"><p className="text-xs text-slate-500">Coverage</p><p className="mt-1 text-sm font-semibold">Mumbai region</p></div></div></div>
      </PageFrame>
    </AppShell>
  );
}
