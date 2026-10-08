import type { Route } from "@/types/route";

/**
 * Calculates the travel-time penalty relative to the fastest route.
 *
 * The fastest route has a penalty of 0. Slower routes receive a penalty
 * equal to their percentage delay, capped at 100.
 */
export function calculateTimePenalty(
  routeTime: number,
  fastestTime: number,
): number {
  if (!Number.isFinite(routeTime) || routeTime < 0) {
    throw new Error("Route time must be a finite, non-negative number.");
  }

  if (!Number.isFinite(fastestTime) || fastestTime <= 0) {
    throw new Error("Fastest route time must be a finite, positive number.");
  }

  const delayRatio = (routeTime - fastestTime) / fastestTime;
  return Math.min(100, delayRatio * 100);
}

/**
 * Calculates the time penalty for every route using the fastest route as the
 * common baseline. Results are returned in the same order as the input.
 */
export function calculateTimePenalties(
  routes: Pick<Route, "durationSeconds">[],
): number[] {
  if (routes.length === 0) {
    return [];
  }

  const fastestTime = Math.min(
    ...routes.map(({ durationSeconds }) => durationSeconds),
  );

  if (!Number.isFinite(fastestTime) || fastestTime <= 0) {
    throw new Error("Fastest route time must be a finite, positive number.");
  }

  return routes.map(({ durationSeconds }) =>
    calculateTimePenalty(durationSeconds, fastestTime),
  );
}

export const getTimePenalty = calculateTimePenalty;
export const getTimePenalties = calculateTimePenalties;