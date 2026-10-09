const timeoutCleanup = Symbol("timeoutCleanup");

type TimedResponse = Response & { [timeoutCleanup]?: () => void };

export function releaseFetchTimeout(response: Response): void {
  (response as TimedResponse)[timeoutCleanup]?.();
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let settled = false;
  const clear = () => {
    if (!settled) {
      settled = true;
      clearTimeout(timeout);
    }
  };

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    (response as TimedResponse)[timeoutCleanup] = clear;
    return response;
  } catch (error) {
    clear();
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`External request timed out after ${timeoutMs}ms.`);
    }
    throw error;
  }
}
