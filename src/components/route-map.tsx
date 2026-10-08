"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  Polyline,
} from "@vis.gl/react-google-maps";
import type { Coordinates, RouteAnalysis } from "@/types/route";
import type { WaterloggingHotspot } from "@/types/hotspot";

const MUMBAI_CENTER = { lat: 19.076, lng: 72.8777 };

const MAP_COLORS = {
  recommended: "#3682F6",
  alternative: "#9CA3AF",
  additional: "#6B7280",
  origin: "#22C55E",
  destination: "#EF4444",
  highRiskHotspot: "#EF4444",
  mediumRiskHotspot: "#F59E0B",
};

type RouteMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routes: RouteAnalysis[];
  recommendedRouteId: string;
  hotspots: WaterloggingHotspot[];
};

function toMapPath(route: RouteAnalysis): { lat: number; lng: number }[] {
  return route.route.geometry.coordinates.map(([lon, lat]) => ({
    lat,
    lng: lon,
  }));
}

function getRouteStyle(
  route: RouteAnalysis,
  recommendedRouteId: string,
): {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  icons?: {
    icon: {
      path: string;
      strokeOpacity: number;
      scale: number;
    };
    offset: string;
    repeat: string;
  }[];
} {
  if (route.route.id === recommendedRouteId) {
    return {
      strokeColor: MAP_COLORS.recommended,
      strokeOpacity: 1,
      strokeWeight: 5,
    };
  }

  if (route.route.label === "alternative") {
    return {
      strokeColor: MAP_COLORS.alternative,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 2,
          },
          offset: "0",
          repeat: "12px",
        },
      ],
    };
  }

  return {
    strokeColor: MAP_COLORS.additional,
    strokeOpacity: 0.7,
    strokeWeight: 3,
  };
}

function HotspotMarker({ hotspot }: { hotspot: WaterloggingHotspot }) {
  const isHighRisk = hotspot.severity === "high";
  const color = isHighRisk
    ? MAP_COLORS.highRiskHotspot
    : MAP_COLORS.mediumRiskHotspot;

  return (
    <AdvancedMarker
      position={{
        lat: hotspot.representativeLocation.lat,
        lng: hotspot.representativeLocation.lon,
      }}
      title={`${hotspot.name} — ${hotspot.severity} risk`}
    >
      <Pin background={color} borderColor={color} glyphColor="#FFFFFF" />
    </AdvancedMarker>
  );
}

export function RouteMap({
  origin,
  destination,
  routes,
  recommendedRouteId,
  hotspots,
}: RouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <section aria-labelledby="map-heading" className="flex flex-col gap-3">
      <div>
        <h2 id="map-heading" className="text-lg font-semibold text-foreground">
          Route map
        </h2>
        <p className="text-sm text-muted-foreground">
          Recommended and alternative routes are shown with relevant waterlogging hotspots.
        </p>
      </div>

      <div className="relative min-h-90 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
          >
            <AdvancedMarker position={{ lat: origin.lat, lng: origin.lon }} title="Origin">
              <Pin
                background={MAP_COLORS.origin}
                borderColor={MAP_COLORS.origin}
                glyphColor="#FFFFFF"
              />
            </AdvancedMarker>

            <AdvancedMarker
              position={{ lat: destination.lat, lng: destination.lon }}
              title="Destination"
            >
              <Pin
                background={MAP_COLORS.destination}
                borderColor={MAP_COLORS.destination}
                glyphColor="#FFFFFF"
              />
            </AdvancedMarker>

            {routes.map((route) => (
              <Polyline
                key={route.route.id}
                path={toMapPath(route)}
                {...getRouteStyle(route, recommendedRouteId)}
                clickable={false}
              />
            ))}

            {hotspots.map((hotspot) => (
              <HotspotMarker key={hotspot.id} hotspot={hotspot} />
            ))}
          </Map>
        </APIProvider>

        <div
          aria-label="Map legend"
          className="absolute bottom-3 left-3 rounded-lg border border-border bg-card/95 p-3 text-xs shadow-md backdrop-blur"
        >
          <p className="mb-2 font-semibold text-foreground">Map legend</p>
          <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <span className="h-1 w-5 rounded-full bg-primary" aria-hidden="true" />
              Recommended route
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 border-t-2 border-dashed border-muted-foreground" aria-hidden="true" />
              Alternative route
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden="true" />
              High-risk hotspot
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-warning" aria-hidden="true" />
              Waterlogging hotspot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
export type { RouteMapProps };
