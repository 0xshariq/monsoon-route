"use client";

import { AppShell, PageFrame } from "@/components/app-shell";
import { LiveMap } from "@/components/live-map";

export default function MapPage() {
  return (
    <AppShell>
      <PageFrame eyebrow="Explore" title="Live map" description="Explore real Google Maps for locations, roads, and route conditions around you.">
        <LiveMap />
      </PageFrame>
    </AppShell>
  );
}
