"use client";

import { Search } from "lucide-react";
import { AppShell, PageFrame } from "@/components/app-shell";
import { LiveMap } from "@/components/live-map";

export default function MapPage() {
  return (
    <AppShell>
      <PageFrame eyebrow="Explore" title="Live map" description="Explore real Google Maps for locations, roads, and route conditions around you.">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 flex w-[min(320px,calc(100%-2rem))] items-center gap-2 rounded-xl border border-white/10 bg-[#071923]/95 px-3 py-3 shadow-lg">
            <Search className="size-4 text-slate-400" />
            <input aria-label="Search location" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search location..." />
          </div>
          <LiveMap />
        </div>
      </PageFrame>
    </AppShell>
  );
}
