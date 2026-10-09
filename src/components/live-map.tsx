"use client";

import { APIProvider, Map, AdvancedMarker, Polyline } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

const MUMBAI = { lat: 19.076, lng: 72.8777 };
const PUNE = { lat: 18.5204, lng: 73.8567 };

export function LiveMap({ compact = false, showLayers = true }: { compact?: boolean; showLayers?: boolean }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (!apiKey) {
    return <div role="alert" className="grid min-h-[360px] place-items-center rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive">Google Maps is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map.</div>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places", "marker"]}>
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${compact ? "min-h-[280px]" : "min-h-[520px]"}`}>
        <Map
          defaultCenter={compact ? { lat: 18.8, lng: 73.35 } : MUMBAI}
          defaultZoom={compact ? 8 : 11}
          mapId="DEMO_MAP_ID"
          colorScheme="DARK"
          gestureHandling="greedy"
          fullscreenControl
          streetViewControl={false}
          mapTypeControl
          style={{ width: "100%", height: "100%", minHeight: compact ? 280 : 520 }}
        >
          <AdvancedMarker position={MUMBAI} title="Mumbai">
            <MapPin className="fill-[#168cff] text-white drop-shadow-lg" />
          </AdvancedMarker>
          <AdvancedMarker position={PUNE} title="Pune">
            <MapPin className="fill-[#42db8b] text-white drop-shadow-lg" />
          </AdvancedMarker>
          <Polyline path={[MUMBAI, PUNE]} options={{ strokeColor: "#269fff", strokeOpacity: 0.9, strokeWeight: 5 }} />
        </Map>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-[#071923]/90 px-3 py-2 text-[11px] text-slate-300">Live Google Maps · Mumbai region</div>
        {showLayers ? <div className="absolute right-3 top-3 rounded-xl border border-white/10 bg-[#071923]/95 p-3 text-xs shadow-xl"><p className="mb-2 font-semibold text-white">Map layers</p><div className="flex flex-col gap-1.5 text-slate-300"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#269fff]" />Rain radar</span><span><i className="mr-2 inline-block size-2 rounded-full bg-[#ff5c74]" />Risk zones</span><span><i className="mr-2 inline-block size-2 rounded-full bg-[#42db8b]" />Route condition</span></div></div> : null}
      </div>
    </APIProvider>
  );
}
