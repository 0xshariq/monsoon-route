"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

const MUMBAI_CENTER = { lat: 19.076, lng: 72.8777 };

export function RouteMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <section aria-labelledby="map-heading" className="flex flex-col gap-3">
      <div>
        <h2 id="map-heading" className="text-lg font-semibold text-foreground">
          Route map
        </h2>
        <p className="text-sm text-muted-foreground">
          Your route and nearby conditions will appear here after analysis.
        </p>
      </div>
      <div className="min-h-[360px] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={MUMBAI_CENTER}
            defaultZoom={11}
            mapId="DEMO_MAP_ID"
            colorScheme="DARK"
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl
            style={{ width: "100%", height: "100%", minHeight: 360 }}
          />
        </APIProvider>
      </div>
    </section>
  );
}

export default RouteMap;
