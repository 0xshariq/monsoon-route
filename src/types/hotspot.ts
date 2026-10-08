import type { Coordinates } from "./route";

export type HotspotSeverity = "medium" | "high";

export type HotspotGeometry =
  | {
      type: "Point";
      coordinates: [number, number];
    }
  | {
      type: "Polygon";
      coordinates: [number, number][][];
    };

export type WaterloggingHotspot = {
  id: string;
  name: string;
  geometry: HotspotGeometry;
  representativeLocation: Coordinates;
  severity: HotspotSeverity;
  documentedEventCount: number;
  authority: string;
  evidence: string[];
};
