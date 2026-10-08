import { z } from "zod";

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const routeRequestSchema = z
  .object({
    origin: coordinatesSchema,
    destination: coordinatesSchema,
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
