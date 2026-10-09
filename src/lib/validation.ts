import { z } from "zod";

export const MUMBAI_OPERATING_BOUNDS = {
  north: 19.35,
  south: 18.85,
  east: 73.15,
  west: 72.65,
} as const;

const coordinatesSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lon: z.number().finite().min(-180).max(180),
});

const supportedRegionCoordinates = coordinatesSchema.refine(
  ({ lat, lon }) =>
    lat >= MUMBAI_OPERATING_BOUNDS.south &&
    lat <= MUMBAI_OPERATING_BOUNDS.north &&
    lon >= MUMBAI_OPERATING_BOUNDS.west &&
    lon <= MUMBAI_OPERATING_BOUNDS.east,
  "Location is outside MonsoonRoute's supported Mumbai urban region.",
);

export const routeRequestSchema = z
  .object({
    origin: supportedRegionCoordinates,
    destination: supportedRegionCoordinates,
    travelMode: z.enum(["DRIVE", "TWO_WHEELER"]),
    departureTime: z.iso.datetime({ offset: true }),
  })
  .refine(
    ({ origin, destination }) =>
      origin.lat !== destination.lat || origin.lon !== destination.lon,
    {
      path: ["destination"],
      message: "Origin and destination must be different.",
    },
  );

export const invalidRequestError = {
  error: {
    code: "INVALID_REQUEST",
    message: "Origin and destination must be different.",
  },
} as const;

export type ValidatedRouteRequest = z.infer<typeof routeRequestSchema>;

export function validateRouteRequest(input: unknown) {
  return routeRequestSchema.safeParse(input);
}

export function getInvalidRequestMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Request validation failed.";
}
